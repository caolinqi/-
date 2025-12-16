<template>
  <div class="lineage-page">
    
    <!-- BACKGROUND GRID -->
    <div class="grid-bg"></div>

    <!-- HUD OVERLAY -->
    <div class="hud-overlay">
        <div class="header-group">
            <h1 class="hud-title">{{ $t('nav.lineage') }} <span class="subtitle">PRE-ALPHA</span></h1>
            <div class="hud-stats">
                <div class="stat-item">
                    <span class="stat-label">NODES</span>
                    <span class="stat-value">{{ nodes.length }}</span>
                </div>
                <!-- Filter Toggles -->
                <div class="filter-group">
                    <button 
                        class="filter-btn" 
                        :class="{ active: filters.pritzker }"
                        @click="toggleFilter('pritzker')"
                    >
                        {{ locale === 'zh-CN' ? '[★ 普利兹克奖]' : '[★ PRITZKER]' }}
                    </button>
                     <button 
                        class="filter-btn" 
                        :class="{ active: filters.metabolism }"
                        @click="toggleFilter('metabolism')"
                    >
                        {{ locale === 'zh-CN' ? '[# 代谢派]' : '[# METABOLISM]' }}
                    </button>
                </div>
            </div>
        </div>
        
        <div class="hud-instruction">
            {{ locale === 'zh-CN' ? '点击节点追踪师承脉络 // 点击背景重置' : 'SELECT NODE TO TRACE LINEAGE // BACKGROUND CLICK TO RESET' }}
        </div>
    </div>

    <!-- D3 CONTAINER -->
    <div ref="container" class="d3-container" @click.self="resetHighlight"></div>

    <!-- SIDE PANEL (Replaces Modal) -->
    <Transition name="slide-right">
        <div v-if="selectedNode" class="side-panel">
            <div class="panel-header">
                <button class="close-btn" @click="selectedNode = null">×</button>
                <div class="panel-avatar">
                   <img :src="selectedNode.image" :alt="selectedNode.name" />
                </div>
                <h2 class="panel-name">{{ getLocalized(selectedNode, 'name') }}</h2>
                <div class="panel-meta">
                    {{ selectedNode.birthYear }} - {{ selectedNode.deathYear || (locale === 'zh-CN' ? '至今' : 'PRESENT') }}
                </div>
            </div>
            
            <div class="panel-body">
                <div class="panel-section">
                    <h3 class="section-title">{{ locale === 'zh-CN' ? '生平 //' : 'BIO //' }}</h3>
                    <p class="panel-text">{{ getLocalized(selectedNode, 'bio') }}</p>
                </div>

                <div class="panel-section">
                    <h3 class="section-title">{{ locale === 'zh-CN' ? '主要成就 //' : 'ACHIEVEMENTS //' }}</h3>
                    <ul class="achieve-list">
                        <li v-for="(ach, i) in (locale === 'zh-CN' ? selectedNode.achievementsJa || selectedNode.achievements : selectedNode.achievements)" :key="i">
                            {{ ach }}
                        </li>
                    </ul>
                </div>

                <div class="panel-footer">
                    <router-link 
                        :to="{ name: 'Profile', params: { id: selectedNode.id } }" 
                        class="full-profile-btn"
                    >
                        {{ locale === 'zh-CN' ? '[ 查看完整档案 ]' : '[ VIEW FULL PROFILE ]' }}
                    </router-link>
                </div>
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue';
import * as d3 from 'd3';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { useLocalized } from '@/composables/useLocalized';
import { useI18n } from 'vue-i18n';
import type { Architect } from '@/types';

const { getLocalized } = useLocalized();
const { locale } = useI18n();
const buildingStore = useBuildingStore();

const container = ref<HTMLElement | null>(null);
const selectedNode = ref<Architect | null>(null);
let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined> | null = null;

// Filters State
const filters = reactive({
    pritzker: false,
    metabolism: false
});

// Graph State
const highlightNodes = ref<Set<number>>(new Set());
const highlightLinks = ref<Set<string>>(new Set()); // "source-target"
const isHighlightActive = ref(false);

const nodes = computed(() => buildingStore.architects.map(a => ({ ...a })));
const links = computed(() => {
    const l: any[] = [];
    buildingStore.architects.forEach(source => {
        if (source.relationships) {
            source.relationships.forEach(rel => {
                const target = buildingStore.architects.find(a => a.id === rel.targetId);
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

// Pritzker Winners Hardcoded List (mock, in reality added to DB)
const PRITZKER_IDS = [1, 2, 4, 18]; // Tange, Ando, Maki, Isozaki (Example IDs)
const METABOLISM_IDS = [1, 17, 18]; // Tange, Kurokawa, Isozaki

onMounted(() => {
    initGraph();
    window.addEventListener('resize', resizeGraph);
});

onUnmounted(() => {
    if(simulation) simulation.stop();
    window.removeEventListener('resize', resizeGraph);
});

const resizeGraph = () => {
    d3.select(container.value).selectAll('*').remove();
    initGraph();
};

const toggleFilter = (type: 'pritzker' | 'metabolism') => {
    filters[type] = !filters[type];
    updateGraphVisuals();
};

const resetHighlight = () => {
    isHighlightActive.value = false;
    highlightNodes.value.clear();
    highlightLinks.value.clear();
    selectedNode.value = null; // Also close panel? Maybe keep it open. Let's unselect.
    updateGraphVisuals();
};

// -- LINEAGE TRACING LOGIC --
const traceLineage = (rootId: number) => {
    isHighlightActive.value = true;
    highlightNodes.value.clear();
    highlightLinks.value.clear();
    
    const visited = new Set<number>();
    const queue: number[] = [rootId];
    
    highlightNodes.value.add(rootId);
    
    // Simple BFS for now? Or specific directional?
    // Let's do: Highlight EVERYTHING connected recursively? 
    // Or Teacher (Up) and Student (Down).
    
    // For now, let's just highlight immediate neighbors + recursive Teacher/Student path
    // Actually, let's just highlight ALL connected components given the small graph size.
    
    // Better: Highlight strictly Teacher relationships going UP, and Student relationships going DOWN.
    
    // 1. Trace Teachers (Upstream)
    const traceUp = (currId: number) => {
        const curr = buildingStore.architects.find(a => a.id === currId);
        if(!curr || !curr.relationships) return;
        
        // Find relationships where curr is Source and type is student? No.
        // Data format: Source (Teacher) -> Relationship (Target is Student usually? Or Source has relation to Target)
        // Assuming: A (Teacher) -> B (Student).
        
        // Finding teachers of Curr means finding who has Curr as target with type 'Teacher'.
        // This is expensive to search every time.
        // Let's just traverse all links since graph is small.
    };

    // Lazy Approach: Just highlight the Node and its direct connections for v1.
    // Enhanced: Recursive.
    
    const traverse = (currentId: number, direction: 'up' | 'down' | 'both') => {
        // Find all links involving currentId
        links.value.forEach(l => {
            // l.source and l.target in links.value are ID numbers initially, 
            // BUT AFTER simulation starts, they become Objects.
            // We need to handle that.
            const sId = (typeof l.source === 'object') ? l.source.id : l.source;
            const tId = (typeof l.target === 'object') ? l.target.id : l.target;
            
            if (sId === currentId && !highlightLinks.value.has(`${sId}-${tId}`)) {
                // Outgoing
                highlightLinks.value.add(`${sId}-${tId}`);
                highlightNodes.value.add(tId);
                traverse(tId, 'down'); // Continue down
            } else if (tId === currentId && !highlightLinks.value.has(`${sId}-${tId}`)) {
                // Incoming
                highlightLinks.value.add(`${sId}-${tId}`);
                highlightNodes.value.add(sId);
                traverse(sId, 'up'); // Continue up
            }
        });
    };
    
    traverse(rootId, 'both');
    updateGraphVisuals();
};


const updateGraphVisuals = () => {
    const svg = d3.select(container.value).select('svg');
    if (svg.empty()) return;
    
    // Node styling
    svg.selectAll('.node-group')
        .classed('dimmed', (d: any) => {
            if (isHighlightActive.value) return !highlightNodes.value.has(d.id);
            if (filters.pritzker && !PRITZKER_IDS.includes(d.id)) return true;
            if (filters.metabolism && !METABOLISM_IDS.includes(d.id)) return true;
            return false;
        })
        .classed('active', (d: any) => highlightNodes.value.has(d.id));

    // Link styling
    svg.selectAll('line')
        .classed('dimmed', (d: any) => {
            if (isHighlightActive.value) {
                const sId = (typeof d.source === 'object') ? d.source.id : d.source;
                const tId = (typeof d.target === 'object') ? d.target.id : d.target;
                return !highlightLinks.value.has(`${sId}-${tId}`);
            }
            return false;
        })
        .classed('active', (d: any) => {
            if (isHighlightActive.value) {
                const sId = (typeof d.source === 'object') ? d.source.id : d.source;
                const tId = (typeof d.target === 'object') ? d.target.id : d.target;
                return highlightLinks.value.has(`${sId}-${tId}`);
            }
            return false;
        });
};


const initGraph = () => {
    if (!container.value) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(container.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // DEFS (Arrows etc)
    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrowcap')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 32) // Radius (42) + offset? No, radius is 20-30.
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#555');

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
        .force('link', d3.forceLink(links.value).id((d: any) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-1000))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(50));

    // Links
    const link = g.append('g')
        .selectAll('line')
        .data(links.value)
        .enter().append('line')
        .attr('class', 'link')
        .attr('marker-end', 'url(#arrowcap)');

    // Nodes
    const node = g.append('g')
        .selectAll('.node-group')
        .data(nodes.value)
        .enter().append('g')
        .attr('class', 'node-group')
        .call(d3.drag<SVGGElement, any, any>()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )
        .on('click', (event, d) => {
            event.stopPropagation();
            selectedNode.value = d as unknown as Architect;
            traceLineage(d.id);
        });

    // Node Visuals
    // 1. Main Circle
    node.append('circle')
        .attr('r', (d: any) => PRITZKER_IDS.includes(d.id) ? 35 : 25)
        .attr('class', (d: any) => PRITZKER_IDS.includes(d.id) ? 'node-circle pritzker' : 'node-circle');

    // 2. Icon/Image (Clipped)
    node.each(function(d) {
        const r = PRITZKER_IDS.includes(d.id) ? 35 : 25;
        const uid = `clip-${d.id}`;
        
        defs.append('clipPath')
            .attr('id', uid)
            .append('circle')
            .attr('r', r - 2); 
            
        if (d.image) {
            d3.select(this).append('image')
                .attr('xlink:href', d.image)
                .attr('x', -r)
                .attr('y', -r)
                .attr('width', r * 2)
                .attr('height', r * 2)
                .attr('clip-path', `url(#${uid})`)
                .attr('preserveAspectRatio', 'xMidYMid slice')
                .attr('class', 'node-img');
        }
    });

    // 3. Label
    node.append('text')
        .attr('dy', (d: any) => PRITZKER_IDS.includes(d.id) ? 50 : 40)
        .attr('text-anchor', 'middle')
        .text((d: any) => getLocalized(d as Architect, 'name'))
        .attr('class', 'node-label');


    // Simulation Tick
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
        if (!event.active) simulation?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) simulation?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Initial Visual Update
    updateGraphVisuals();
};

watch(locale, () => {
    resizeGraph();
});
</script>


<style lang="scss">
/* D3 GLOBAL STYLES */
.link {
    stroke: #444;
    stroke-width: 1.5;
    transition: all 0.3s;
    &.dimmed { stroke-opacity: 0.1; }
    &.active { stroke: #00ffcc; stroke-width: 2.5; stroke-opacity: 1; }
}

.node-circle {
    fill: #111;
    stroke: #666;
    stroke-width: 2;
    transition: all 0.3s;
    
    &.pritzker { stroke: #ffd700; } // Gold for Pritzker
}

.node-group {
    cursor: pointer;
    transition: opacity 0.3s;
    
    &.dimmed { opacity: 0.2; }
    &.active { 
        opacity: 1;
        .node-circle { stroke: #00ffcc; stroke-width: 3; }
        .node-label { fill: #00ffcc; font-weight: 700; }
    }
    
    &:hover {
        .node-circle { stroke: #fff; }
    }
}

.node-label {
    fill: #ccc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    pointer-events: none;
    text-shadow: 0 0 3px #000;
}
</style>

<style scoped lang="scss">
.lineage-page {
    width: 100vw;
    height: 100vh;
    background: #050505;
    overflow: hidden;
    position: relative;
    color: #fff;
    padding-top: 80px; /* Space for Nav */
}

.grid-bg {
    position: absolute; inset: 0;
    opacity: 0.1;
    background-image: 
        linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
}

.hud-overlay {
    position: absolute;
    top: 100px; /* Moved down to avoid Nav conflict */
    left: 40px; right: 40px;
    z-index: 100;
    pointer-events: none;
    
    .header-group {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: auto;
    }
}

.hud-title {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -1px;
    
    .subtitle {
        font-family: 'JetBrains Mono';
        font-size: 0.8rem;
        color: #ff3333;
        vertical-align: super;
    }
}

.hud-stats {
    display: flex;
    gap: 30px;
    align-items: center;
}

.stat-item {
    display: flex; flex-direction: column; align-items: flex-end;
    .stat-label { font-size: 0.7rem; color: #666; font-family: 'JetBrains Mono'; }
    .stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1; }
}

.filter-group {
    display: flex; gap: 10px;
    margin-left: 20px;
}

.filter-btn {
    background: rgba(0,0,0,0.5);
    border: 1px solid #333;
    color: #666;
    padding: 8px 12px;
    font-family: 'JetBrains Mono';
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover { border-color: #fff; color: #fff; }
    &.active { border-color: #00ffcc; color: #00ffcc; background: rgba(0,255,204,0.1); }
}

.hud-instruction {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    font-family: 'JetBrains Mono'; color: #444; font-size: 0.8rem;
    pointer-events: none;
}

.d3-container {
    width: 100%; height: 100%;
    cursor: grab;
    &:active { cursor: grabbing; }
}

/* SIDE PANEL */
.side-panel {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 400px;
    background: rgba(10, 10, 10, 0.95);
    border-left: 1px solid #333;
    backdrop-filter: blur(10px);
    z-index: 200;
    display: flex; flex-direction: column;
    box-shadow: -10px 0 50px rgba(0,0,0,0.8);
    padding-top: 80px; /* Adjust for Top Nav if needed, though z-index usually covers it. Let's keep it full height but content padded. */
}

.panel-header {
    padding: 30px;
    border-bottom: 1px solid #222;
    position: relative;
    text-align: center;
    padding-top: 10px;
}

.close-btn {
    position: absolute; top: 10px; right: 10px;
    background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;
    &:hover { color: #ff3333; }
}

.panel-avatar {
    width: 100px; height: 100px; border-radius: 50%; overflow: hidden;
    margin: 0 auto 15px; border: 2px solid #333;
    img { width: 100%; height: 100%; object-fit: cover; }
}

.panel-name { font-size: 1.5rem; font-weight: 700; margin: 0 0 5px; }
.panel-meta { font-family: 'JetBrains Mono'; color: #666; font-size: 0.8rem; }

.panel-body {
    flex: 1; overflow-y: auto; padding: 30px;
}

.panel-section { margin-bottom: 30px; }
.section-title {
    font-family: 'JetBrains Mono'; font-size: 0.8rem; color: #00ffcc;
    margin-bottom: 10px; border-bottom: 1px dashed #333; padding-bottom: 5px;
}

.panel-text { line-height: 1.6; color: #ccc; font-size: 0.95rem; }

.achieve-list li {
    margin-bottom: 8px; color: #bbb; font-size: 0.9rem;
    &:before { content: '>'; color: #444; margin-right: 8px; }
}

.panel-footer {
    padding: 20px; border-top: 1px solid #222; text-align: center;
}

.full-profile-btn {
    display: inline-block;
    padding: 12px 24px;
    border: 1px solid #fff;
    color: #fff;
    text-decoration: none;
    font-family: 'JetBrains Mono';
    font-weight: 700;
    transition: all 0.2s;
    
    &:hover {
        background: #fff; color: #000;
    }
}

/* Transitions */
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s ease; }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>

