export interface Badge {
    id: string;
    name: string;
    nameEn: string;
    nameJa: string;
    description: string;
    descriptionEn: string;
    descriptionJa: string;
    icon: string; // Could be a simple class name or emoji for now, or asset path
    condition?: string; // Description of how to get it
}

export const badges: Badge[] = [
    {
        id: 'novice_architect',
        name: '建筑新手',
        nameEn: 'Novice Architect',
        nameJa: '建築初心者',
        description: '完成第一次测验',
        descriptionEn: 'Complete your first quiz',
        descriptionJa: '最初のクイズを完了する',
        icon: 'BuildOutlined'
    },
    {
        id: 'quiz_master',
        name: '答题大师',
        nameEn: 'Quiz Master',
        nameJa: 'クイズ・マスター',
        description: '在一次测验中获得满分',
        descriptionEn: 'Get a perfect score in a quiz',
        descriptionJa: 'クイズで満点を取る',
        icon: 'TrophyOutlined'
    },
    {
        id: 'material_master',
        name: '材料专家',
        nameEn: 'Material Master',
        nameJa: '素材のマエストロ',
        description: '完成建筑拼图挑战',
        descriptionEn: 'Complete the material puzzle challenge',
        descriptionJa: '建築パズルチャレンジを完了する',
        icon: 'BlockOutlined'
    },
    {
        id: 'historian',
        name: '历史学家',
        nameEn: 'Historian',
        nameJa: '歴史家',
        description: '达到等级 5',
        descriptionEn: 'Reach Level 5',
        descriptionJa: 'レベル5に到達する',
        icon: 'BookOutlined'
    },
    {
        id: 'visionary',
        name: '远见卓识',
        nameEn: 'Visionary',
        nameJa: '先見の明',
        description: '达到等级 10',
        descriptionEn: 'Reach Level 10',
        descriptionJa: 'レベル10に到達する',
        icon: 'EyeOutlined'
    }
]
