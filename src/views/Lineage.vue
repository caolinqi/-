<template>
  <div class="lineage-page">
    <!-- Overlay UI -->
    <div class="hud-overlay">
        <h1 class="hud-title">{{ $t('nav.lineage') }}</h1>
        <div class="hud-stats">
            <div class="stat-item">
                <span class="stat-label">NODES_ACTIVE</span>
                <span class="stat-value">{{ nodes.length }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">LINKS_ESTABLISHED</span>
                <span class="stat-value">{{ links.length }}</span>
            </div>
        </div>
        <div class="hud-instruction">
            DRAG NODES TO REORGANIZE // SCROLL TO ZOOM
        </div>
    </div>

    <!-- D3 Container -->
    <div ref="container" class="d3-container"></div>

    <!-- Detail Modal (Reusing structure, could be a component) -->
    <Transition name="fade">
        <div v-if="selectedNode" class="node-modal-overlay" @click.self="selectedNode = null">
            <div class="node-modal">
                <div class="modal-header">
                    <img :src="selectedNode.image" :alt="selectedNode.name" class="modal-img" />
                    <div class="modal-title-group">
                        <h2>{{ getLocalized(selectedNode, 'name') }}</h2>
                        <span class="modal-years" v-if="selectedNode.birthYear">
                            {{ selectedNode.birthYear }} - {{ selectedNode.deathYear || 'PRESENT' }}
                        </span>
                    </div>
                    <button class="close-btn" @click="selectedNode = null">×</button>
                </div>
                <div class="modal-body">
                    <p class="modal-bio">{{ getLocalized(selectedNode, 'bio') }}</p>
                    
                    <div class="modal-achievements">
                        <h3>KEY_ACHIEVEMENTS //</h3>
                        <ul>
                            <li v-for="(ach, i) in (locale === 'zh-CN' ? selectedNode.achievementsJa || selectedNode.achievements : selectedNode.achievements)" :key="i">
                                {{ ach }}
                            </li>
                        </ul>
                    </div>
                </div>
                 <div class="modal-footer">
                    <router-link 
                        :to="{ name: 'Profile', params: { id: selectedNode.id } }" 
                        class="profile-link-btn"
                    >
                        ACCESS FULL PROFILE &rarr;
                    </router-link>
                </div>
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import * as d3 from 'd3';
import { architects } from '@/data/architects'; // Use simple architects data first
import { useLocalized } from '@/composables/useLocalized';
import { useI18n } from 'vue-i18n';
import type { Architect, Relationship } from '@/types';

const { getLocalized } = useLocalized();
const { locale } = useI18n();

const container = ref<HTMLElement | null>(null);
const selectedNode = ref<Architect | null>(null);

// Transform data for D3
// Nodes: Architects
// Links: Distinct relationships
const nodes = computed(() => architects.map(a => ({ ...a })));
const links = computed(() => {
    const l: any[] = [];
    architects.forEach(source => {
        if (source.relationships) {
            source.relationships.forEach(rel => {
                // Find target
                const target = architects.find(a => a.id === rel.targetId);
                if (target) {
                    l.push({
                        source: source.id,
                        target: target.id,
                        type: rel.type
                    });
                }
            });
        }
    });
    return l;
});

let simulation: d3.Simulation<any, undefined>;

onMounted(() => {
    initGraph();
    window.addEventListener('resize', resizeGraph);
});

onUnmounted(() => {
    if(simulation) simulation.stop();
    window.removeEventListener('resize', resizeGraph);
});

const resizeGraph = () => {
    // Simple reload for now, or update dimensions
    d3.select(container.value).selectAll('*').remove();
    initGraph();
};

const initGraph = () => {
    if (!container.value) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(container.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#050505');

    // Zoom Group
    const g = svg.append('g');

    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom as any);

    // Forces
    simulation = d3.forceSimulation(nodes.value)
        .force('link', d3.forceLink(links.value).id((d: any) => d.id).distance(200))
        .force('charge', d3.forceManyBody().strength(-800))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(60));

    // Links
    const link = g.append('g')
        .selectAll('line')
        .data(links.value)
        .enter().append('line')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.6);

    // Nodes (Groups with Circle + Image + Text)
    const node = g.append('g')
        .selectAll('.node')
        .data(nodes.value)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag<SVGGElement, any, any>()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )
        .on('click', (event, d) => {
            selectedNode.value = d as unknown as Architect;
        });

    // Node Circle (Halo)
    node.append('circle')
        .attr('r', 42)
        .attr('fill', '#1a1a1a')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

    // Node Image (ClipPath)
    // Unique ID for clip path
    const defs = svg.append('defs');
    
    node.each(function(d) {
        const uid = `clip-${d.id}`;
        defs.append('clipPath')
            .attr('id', uid)
            .append('circle')
            .attr('r', 40);
            
        d3.select(this).append('image')
            .attr('xlink:href', d.image)
            .attr('x', -40)
            .attr('y', -40)
            .attr('width', 80)
            .attr('height', 80)
            .attr('clip-path', `url(#${uid})`)
            .attr('preserveAspectRatio', 'xMidYMid slice');
    });

    // Node Labels
    node.append('text')
        .attr('dy', 60)
        .attr('text-anchor', 'middle')
        .text((d: any) => getLocalized(d as Architect, 'name'))
        .style('fill', '#fff')
        .style('font-family', 'JetBrains Mono')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)');


    simulation.on('tick', () => {
        link
            .attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any) => d.target.x)
            .attr('y2', (d: any) => d.target.y);

        node
            .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};

// Re-render text on locale change
watch(locale, () => {
    resizeGraph();
});
</script>

<style scoped lang="scss">
.lineage-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #050505;
}

.d3-container {
    width: 100%;
    height: 100%;
    cursor: grab;
    &:active { cursor: grabbing; }
}

.hud-overlay {
    position: absolute;
    top: 80px;
    left: 40px;
    z-index: 10;
    pointer-events: none;
}

.hud-title {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 3rem;
    color: #fff;
    margin: 0;
    letter-spacing: -0.02em;
    text-transform: uppercase;
}

.hud-stats {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-item {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: #888;
    display: flex;
    gap: 12px;
}

.stat-value {
    color: #fff;
    font-weight: bold;
}

.hud-instruction {
    margin-top: 40px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #555;
    border-left: 2px solid #333;
    padding-left: 12px;
}

/* Modal */
.node-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.node-modal {
    width: 600px;
    max-width: 90vw;
    background: #0a0a0a;
    border: 1px solid #333;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #222;
    gap: 20px;
}

.modal-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
}

.modal-title-group {
    flex: 1;
    h2 {
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        font-size: 1.8rem;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
    }
    .modal-years {
        font-family: 'JetBrains Mono', monospace;
        color: #666;
        font-size: 0.9rem;
    }
}

.close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    &:hover { color: #f00; }
}

.modal-body {
    padding: 30px;
    color: #ccc;
    font-family: 'Noto Serif JP', serif;
    line-height: 1.8;
}

.modal-bio {
    margin-bottom: 30px;
    font-size: 1.1rem;
}

.modal-achievements {
    h3 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 16px;
    }
    ul {
        list-style: none;
        padding: 0;
        li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            color: #aaa;
            font-family: 'Inter', sans-serif;
            &::before {
                content: '//';
                position: absolute;
                left: 0;
                color: #444;
                font-size: 0.8rem;
            }
        }
    }
}

.modal-footer {
    padding: 20px 30px;
    background: #000;
    border-top: 1px solid #222;
    display: flex;
    justify-content: flex-end;
}

.profile-link-btn {
    color: #fff;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    border: 1px solid #444;
    padding: 10px 20px;
    transition: all 0.3s;
    &:hover {
        background: #fff;
        color: #000;
    }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
