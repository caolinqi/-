export interface QuizQuestion {
    id: number;
    question: string;
    questionEn: string;
    questionJa: string;
    options: {
        id: string; // 'A', 'B', 'C', 'D'
        text: string;
        textEn: string;
        textJa: string;
        isCorrect: boolean;
    }[];
}

export const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "谁是东京站的设计师？",
        questionEn: "Who is the architect of Tokyo Station?",
        questionJa: "東京駅の設計者は誰ですか？",
        options: [
            { id: 'A', text: '安藤忠雄', textEn: 'Tadao Ando', textJa: '安藤忠雄', isCorrect: false },
            { id: 'B', text: '辰野金吾', textEn: 'Tatsuno Kingo', textJa: '辰野金吾', isCorrect: true },
            { id: 'C', text: '丹下健三', textEn: 'Tange Kenzo', textJa: '丹下健三', isCorrect: false },
            { id: 'D', text: '隈研吾', textEn: 'Kengo Kuma', textJa: '隈研吾', isCorrect: false }
        ]
    },
    {
        id: 2,
        question: "代代木体育馆是为哪一届奥运会设计的？",
        questionEn: "For which Olympics was the Yoyogi National Gymnasium designed?",
        questionJa: "国立代々木競技場はどのオリンピックのために設計されましたか？",
        options: [
            { id: 'A', text: '1964年东京奥运会', textEn: '1964 Tokyo Olympics', textJa: '1964年東京オリンピック', isCorrect: true },
            { id: 'B', text: '2020年东京奥运会', textEn: '2020 Tokyo Olympics', textJa: '2020年東京オリンピック', isCorrect: false },
            { id: 'C', text: '1972年札幌冬奥会', textEn: '1972 Sapporo Winter Olympics', textJa: '1972年札幌冬季オリンピック', isCorrect: false },
            { id: 'D', text: '1998年长野冬奥会', textEn: '1998 Nagano Winter Olympics', textJa: '1998年長野冬季オリンピック', isCorrect: false }
        ]
    },
    {
        id: 3,
        question: "安藤忠雄以使用什么材料闻名？",
        questionEn: "What material is Tadao Ando famous for using?",
        questionJa: "安藤忠雄は何の素材を使うことで有名ですか？",
        options: [
            { id: 'A', text: '红砖', textEn: 'Red Brick', textJa: '赤煉瓦', isCorrect: false },
            { id: 'B', text: '木材', textEn: 'Wood', textJa: '木材', isCorrect: false },
            { id: 'C', text: '清水混凝土', textEn: 'Exposed Concrete', textJa: '打放しコンクリート', isCorrect: true },
            { id: 'D', text: '玻璃', textEn: 'Glass', textJa: 'ガラス', isCorrect: false }
        ]
    },
    {
        id: 4,
        question: "以下哪位建筑师获得了普利兹克奖？",
        questionEn: "Which of the following architects won the Pritzker Prize?",
        questionJa: "次の建築家のうち、プリツカー賞を受賞したのは誰ですか？",
        options: [
            { id: 'A', text: '辰野金吾', textEn: 'Tatsuno Kingo', textJa: '辰野金吾', isCorrect: false },
            { id: 'B', text: '伊东丰雄', textEn: 'Toyo Ito', textJa: '伊東豊雄', isCorrect: true },
            { id: 'C', text: '前川国男', textEn: 'Kunio Maekawa', textJa: '前川國男', isCorrect: false },
            { id: 'D', text: '村野藤吾', textEn: 'Togo Murano', textJa: '村野藤吾', isCorrect: false }
        ]
    },
    {
        id: 5,
        question: "“新陈代谢派”的核心思想是什么？",
        questionEn: "What is the core idea of 'Metabolism'?",
        questionJa: "「メタボリズム」の核心的な考え方は何ですか？",
        options: [
            { id: 'A', text: '回归古典', textEn: 'Return to Classics', textJa: '古典への回帰', isCorrect: false },
            { id: 'B', text: '建筑像生物一样生长与变化', textEn: 'Buildings grow and change like organisms', textJa: '建築は生物のように成長し変化する', isCorrect: true },
            { id: 'C', text: '极简主义', textEn: 'Minimalism', textJa: 'ミニマリズム', isCorrect: false },
            { id: 'D', text: '装饰至上', textEn: 'Decoration First', textJa: '装飾至上主義', isCorrect: false }
        ]
    }
]
