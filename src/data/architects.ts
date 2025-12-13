// import type { Architect } from '@/types'

// export const architects: Architect[] = [
//     {
//         id: 1,
//         name: "辰野金吾",
//         nameEn: "Tatsuno Kingo",
//         nameJa: "辰野金吾",
//         birthYear: 1854,
//         deathYear: 1919,
//         bio: "日本近代建筑之父，师从英国建筑师乔赛亚·康德，设计了东京站、日本银行等标志性建筑。",
//         bioEn: "The father of modern Japanese architecture, studied under British architect Josiah Conder, designed Tokyo Station and the Bank of Japan.",
//         bioJa: "日本近代建築の父。ジョサイア・コンドルに師事し、東京駅や日本銀行本店などを設計した。",
//         image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
//         buildings: [1],
//         achievements: [
//             "日本建筑学会首任会长",
//             "明治时期建筑教育奠基人",
//             "西方建筑风格本土化的先驱"
//         ],
//         achievementsJa: [
//             "日本建築学会初代会長",
//             "明治時代の建築教育の基礎を築く",
//             "西洋建築様式の定着に貢献"
//         ]
//     },
//     {
//         id: 2,
//         name: "丹下健三",
//         nameEn: "Tange Kenzo",
//         nameJa: "丹下健三",
//         birthYear: 1913,
//         deathYear: 2005,
//         bio: "日本现代建筑大师，1964年东京奥运会主会场设计师，代代木体育馆是其代表作。",
//         bioEn: "Master of modern Japanese architecture, designer of the main venue for the 1964 Tokyo Olympics, Yoyogi Gymnasium is his masterpiece.",
//         bioJa: "日本を代表する建築家。1964年東京オリンピックの国立代々木競技場などを設計し、世界のタンゲとして知られる。",
//         image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//         buildings: [5],
//         achievements: [
//             "普利兹克建筑奖得主（1987年）",
//             "代代木体育馆设计者",
//             "日本现代建筑运动领袖"
//         ],
//         achievementsJa: [
//             "1987年プリツカー賞受賞",
//             "国立代々木競技場の設計",
//             "日本現代建築界の重鎮"
//         ]
//     },
//     {
//         id: 3,
//         name: "安藤忠雄",
//         nameEn: "Tadao Ando",
//         nameJa: "安藤忠雄",
//         birthYear: 1941,
//         bio: "自学成才的建筑师，以混凝土建筑闻名，住吉长屋是其早期代表作。",
//         bioEn: "Self-taught architect, famous for concrete architecture, Azuma House is his early masterpiece.",
//         bioJa: "独学で建築を学んだ建築家。打ち放しコンクリートの建築で知られ、代表作に「住吉の長屋」などがある。",
//         image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
//         buildings: [6],
//         achievements: [
//             "普利兹克建筑奖得主（1995年）",
//             "混凝土建筑大师",
//             "光与影的诗人"
//         ],
//         achievementsJa: [
//             "1995年プリツカー賞受賞",
//             "コンクリート建築の巨匠",
//             "光と影の魔術師"
//         ]
//     },
//     {
//         id: 4,
//         name: "伊东丰雄",
//         nameEn: "Toyo Ito",
//         nameJa: "伊東豊雄",
//         birthYear: 1941,
//         bio: "日本当代建筑大师，以流动性和轻盈感著称，风之塔是其早期重要作品。",
//         bioEn: "Master of contemporary Japanese architecture, known for fluidity and lightness, Tower of Winds is his early important work.",
//         bioJa: "現代日本を代表する建築家の一人。流動的で軽やかな建築表現で知られ、「せんだいメディアテーク」などが代表作。",
//         image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//         buildings: [7],
//         achievements: [
//             "普利兹克建筑奖得主（2013年）",
//             "流动建筑理论的倡导者",
//             "数字时代的建筑探索者"
//         ],
//         achievementsJa: [
//             "2013年プリツカー賞受賞",
//             "流動的な建築理論の提唱",
//             "デジタル時代の建築の探求"
//         ]
//     },
//     {
//         id: 5,
//         name: "妹岛和世",
//         nameEn: "Sejima Kazuyo",
//         nameJa: "妹島和世",
//         birthYear: 1956,
//         bio: "SANAA事务所创始人之一，与西泽立卫共同获得2010年普利兹克建筑奖。",
//         bioEn: "Co-founder of SANAA, jointly won the 2010 Pritzker Architecture Prize with Nishizawa Ryue.",
//         bioJa: "SANAAの創設者の一人。西沢立衛と共に2010年にプリツカー賞を受賞。金沢21世紀美術館などを設計。",
//         image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
//         buildings: [8],
//         achievements: [
//             "普利兹克建筑奖得主（2010年）",
//             "21世纪美术馆设计者",
//             "极简主义建筑的代表"
//         ],
//         achievementsJa: [
//             "2010年プリツカー賞受賞",
//             "金沢21世紀美術館の設計",
//             "ミニマリズム建築の代表"
//         ]
//     },
//     {
//         id: 6,
//         name: "西泽立卫",
//         nameEn: "Nishizawa Ryue",
//         nameJa: "西沢立衛",
//         birthYear: 1966,
//         bio: "SANAA事务所创始人之一，与妹岛和世共同获得2010年普利兹克建筑奖。",
//         bioEn: "Co-founder of SANAA, jointly won the 2010 Pritzker Architecture Prize with Sejima Kazuyo.",
//         bioJa: "SANAAの創設者の一人。妹島和世と共に2010年にプリツカー賞を受賞。",
//         image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
//         buildings: [8],
//         achievements: [
//             "普利兹克建筑奖得主（2010年）",
//             "21世纪美术馆设计者",
//             "透明性与开放性的探索者"
//         ],
//         achievementsJa: [
//             "2010年プリツカー賞受賞",
//             "金沢21世紀美術館の設計",
//             "透明性と開放性の探求"
//         ]
//     },
//     {
//         id: 7,
//         name: "王献臣等",
//         nameEn: "Wang Xianchen et al.",
//         nameJa: "王献臣 他",
//         birthYear: 1460,
//         deathYear: 1530,
//         bio: "明代官员与匠师合作建造拙政园，形成江南私家园林范式。",
//         bioEn: "Ming dynasty official and craftsmen behind the Humble Administrator's Garden, a Jiangnan garden archetype.",
//         bioJa: "明代の官僚と職人が協力して拙政園を建設し、江南私家園林の模範を作り上げた。",
//         image: "https://img0.baidu.com/it/u=1250580355,3789149898&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=656",
//         buildings: [9],
//         achievements: ["拙政园营建与扩建", "江南园林造园技法集大成"],
//         achievementsJa: ["拙政園の造営と拡張", "江南庭園造園技法の集大成"]
//     },
//     {
//         id: 8,
//         name: "传统匠师（四合院）",
//         nameEn: "Traditional Craftsmen (Siheyuan)",
//         nameJa: "伝統的職人（四合院）",
//         birthYear: 1600,
//         bio: "四合院由传统匠师传承营造技艺，体现北方民居的空间礼制。",
//         bioEn: "Siheyuan constructed by traditional craftsmen, embodying spatial order and ritual of northern dwellings.",
//         bioJa: "伝統的な職人によって受け継がれた技術で建設された四合院は、北方民家の空間秩序と礼節を体現している。",
//         image: "https://img0.baidu.com/it/u=2569130074,3372136459&fm=253&app=138&f=JPEG?w=400&h=300",
//         buildings: [10],
//         achievements: ["北京四合院传统作法传承", "木构与院落空间营造"],
//         achievementsJa: ["北京四合院の伝統技法の継承", "木造構造と中庭空間の造営"]
//     },
//     {
//         id: 9,
//         name: "传统匠师（窑洞）",
//         nameEn: "Traditional Craftsmen (Yaodong)",
//         nameJa: "伝統的職人（ヤオトン）",
//         birthYear: 1300,
//         bio: "黄土高原地区窑洞的因地制宜建造者，形成独特穴居体系。",
//         bioEn: "Builders of loess plateau yaodong cave dwellings, an adaptive earth-sheltered system.",
//         bioJa: "黄土高原地域のヤオトン（窯洞）をその土地に適して建設し、独自の穴居体系を形成した。",
//         image: "https://gips2.baidu.com/it/u=3768236364,1546052519&fm=3074&app=3074&f=JPEG",
//         buildings: [11],
//         achievements: ["窑洞拱券与覆土保温技术", "地域性可持续建造"],
//         achievementsJa: ["ヤオトンのアーチと覆土保温技術", "地域的な持続可能な建築"]
//     },
//     {
//         id: 10,
//         name: "游牧民集体智慧",
//         nameEn: "Nomadic Collective Wisdom",
//         nameJa: "遊牧民の集合知",
//         birthYear: 1100,
//         bio: "草原游牧民在长期迁徙中形成的蒙古包结构与营造技艺。",
//         bioEn: "Nomadic structural and construction know-how forming the Mongolian yurt.",
//         bioJa: "草原の遊牧民が長期間の移動の中で形成したパオ（ゲル）の構造と建設技術。",
//         image: "https://q6.itc.cn/images01/20250520/256cda8941974ba18fcbfa42b71e29f9.jpeg",
//         buildings: [12],
//         achievements: ["可拆装圆形居所体系", "木骨与毡皮结构技术"],
//         achievementsJa: ["組み立て可能な円形住居システム", "木骨とフェルトの構造技術"]
//     },
//     {
//         id: 11,
//         name: "客家聚落",
//         nameEn: "Hakka Community",
//         nameJa: "客家集落",
//         birthYear: 1600,
//         bio: "客家人共同营造的夯土围屋，兼具居住、防御与社会组织功能。",
//         bioEn: "Communal rammed-earth tulou integrating residence, defense and social organization.",
//         bioJa: "客家人が共同で建設した版築の囲龍屋は、居住、防御、社会組織の機能を兼ね備えている。",
//         image: "https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00712-417.jpg",
//         buildings: [13],
//         achievements: ["大型夯土围屋体系", "聚族而居的社会空间组织"],
//         achievementsJa: ["大規模な版築囲郭住居システム", "一族が集住する社会空間組織"]
//     },
//     {
//         id: 12,
//         name: "贝聿铭",
//         nameEn: "Ieoh Ming Pei",
//         nameJa: "貝聿銘",
//         birthYear: 1917,
//         deathYear: 2019,
//         bio: "国际著名华人建筑师，现代主义与地域文化融合的代表人物。",
//         bioEn: "Renowned Chinese-American architect blending modernism with cultural context.",
//         bioJa: "世界的に有名な中国系アメリカ人建築家。モダニズムと地域文化の融合を代表する人物。",
//         image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//         buildings: [],
//         achievements: ["普利兹克建筑奖（1983）", "卢浮宫玻璃金字塔等代表作品"],
//         achievementsJa: ["1983年プリツカー賞受賞", "ルーヴル美術館ガラスのピラミッドなどの代表作"]
//     },
// ]


import type { Architect } from '@/types'

export const architects: Architect[] = [
    {
        id: 1,
        name: "宫大工团队",
        nameEn: "Shrine Carpenters Team",
        nameJa: "宮大工チーム",
        birthYear: null,
        deathYear: null,
        bio: "伊势神宫由传统宫大工团队建造，每20年进行式年迁宫重建，传承神道建筑的纯净与再生。",
        bioEn: "Ise Jingu is built by traditional shrine carpenters, rebuilt every 20 years in the Shikinen Sengu tradition.",
        bioJa: "伊勢神宮は伝統的な宮大工チームによって建造され、20年ごとに式年遷宮で再建される。",
        image: "https://www.ejrcf.or.jp/gallery/common/img/institution/img_institution_highlights_07_1.jpg", // 传统工匠代表图像
        buildings: [1],
        achievements: [
            "式年迁宫传统传承",
            "神明造建筑技法守护者"
        ],
        achievementsJa: [
            "式年遷宮の伝統継承",
            "神明造建築技法の守護者"
        ]
    },
    {
        id: 2,
        name: "传统宫大工团队",
        nameEn: "Traditional Shrine Carpenters",
        nameJa: "伝統的宮大工チーム",
        birthYear: null,
        deathYear: null,
        bio: "出云大社由传统宫大工团队建造，日本最古老神社的守护者。",
        bioEn: "Izumo Taisha built by traditional shrine carpenters, guardian of Japan's oldest shrine.",
        bioJa: "出雲大社は伝統的な宮大工チームによって建造され、日本最古の神社。",
        image: "https://www.ejrcf.or.jp/gallery/common/img/institution/img_institution_highlights_07_1.jpg", // 类似传统图像
        buildings: [2],
        achievements: [
            "大社造建筑传承",
            "古老神社维护"
        ],
        achievementsJa: [
            "大社造建築の継承",
            "最古神社の維持"
        ]
    },
    {
        id: 3,
        name: "足利义满（主导）&寺院大工",
        nameEn: "Ashikaga Yoshimitsu (Patron) & Temple Carpenters",
        nameJa: "足利義満（主導）＆寺院大工",
        birthYear: 1358,
        deathYear: 1408,
        bio: "室町幕府将军足利义满主导建造金阁寺，北山文化代表。",
        bioEn: "Shogun Ashikaga Yoshimitsu patronized the construction of Kinkaku-ji, representative of Kitayama culture.",
        bioJa: "室町幕府将軍足利義満が主導した金閣寺、北山文化の代表。",
        image: "https://architecture-history.org/architects/architects/TANGE/2.jpg", // 历史人物代表
        buildings: [3],
        achievements: [
            "北山文化建筑主导",
            "金箔禅宗寺院创建"
        ],
        achievementsJa: [
            "北山文化建築の主導",
            "金箔禅宗寺院の創建"
        ]
    },
    {
        id: 4,
        name: "足利义政（主导）&寺院大工",
        nameEn: "Ashikaga Yoshimasa (Patron) & Temple Carpenters",
        nameJa: "足利義政（主導）＆寺院大工",
        birthYear: 1436,
        deathYear: 1490,
        bio: "室町幕府将军足利义政主导建造银阁寺，东山文化代表。",
        bioEn: "Shogun Ashikaga Yoshimasa patronized the construction of Ginkaku-ji, representative of Higashiyama culture.",
        bioJa: "室町幕府将軍足利義政が主導した銀閣寺、東山文化の代表。",
        image: "https://architecture-history.org/architects/architects/TANGE/2.jpg", // 类似
        buildings: [4],
        achievements: [
            "东山文化代表建筑",
            "禅意庭园创建"
        ],
        achievementsJa: [
            "東山文化の代表建築",
            "禅意庭園の創建"
        ]
    },
    {
        id: 5,
        name: "传统寺院大工",
        nameEn: "Traditional Temple Carpenters",
        nameJa: "伝統的寺院大工",
        birthYear: null,
        deathYear: null,
        bio: "清水寺由传统寺院大工建造，著名悬造舞台。",
        bioEn: "Kiyomizu-dera built by traditional temple carpenters, famous for suspended stage.",
        bioJa: "清水寺は伝統的な寺院大工によって建造され、有名な懸造舞台。",
        image: "https://www.ejrcf.or.jp/gallery/common/img/institution/img_institution_highlights_07_1.jpg",
        buildings: [5],
        achievements: [
            "悬造技术传承",
            "京都名胜维护"
        ],
        achievementsJa: [
            "懸造技術の継承",
            "京都名勝の維持"
        ]
    },
    {
        id: 6,
        name: "池田辉政等",
        nameEn: "Ikeda Terumasa et al.",
        nameJa: "池田輝政 他",
        birthYear: null,
        deathYear: null,
        bio: "战国时代大名主导建造姬路城，日本三大名城。",
        bioEn: "Daimyo Ikeda Terumasa patronized Himeji Castle, one of Japan's three great castles.",
        bioJa: "戦国時代大名が主導した姫路城、日本三名城。",
        image: "https://architecture-history.org/architects/architects/TANGE/2.jpg",
        buildings: [6],
        achievements: [
            "白鹭城建造",
            "城郭防御技术"
        ],
        achievementsJa: [
            "白鷺城の建造",
            "城郭防御技術"
        ]
    },
    {
        id: 7,
        name: "丰臣秀吉（主导）",
        nameEn: "Toyotomi Hideyoshi (Patron)",
        nameJa: "豊臣秀吉（主導）",
        birthYear: 1537,
        deathYear: 1598,
        bio: "战国大名丰臣秀吉主导建造大阪城。",
        bioEn: "Daimyo Toyotomi Hideyoshi patronized Osaka Castle.",
        bioJa: "戦国大名豊臣秀吉が主導した大阪城。",
        image: "https://architecture-history.org/architects/architects/TANGE/2.jpg",
        buildings: [7],
        achievements: [
            "巨石墙城堡",
            "战国时代代表"
        ],
        achievementsJa: [
            "巨石垣城堡",
            "戦国時代の代表"
        ]
    },
    {
        id: 8,
        name: "辰野金吾",
        nameEn: "Tatsuno Kingo",
        nameJa: "辰野金吾",
        birthYear: 1854,
        deathYear: 1919,
        bio: "日本近代建筑之父，设计东京站等红砖建筑。",
        bioEn: "Father of modern Japanese architecture, designed Tokyo Station.",
        bioJa: "日本近代建築の父、東京駅などの赤レンガ建築設計。",
        image: "https://www.ejrcf.or.jp/gallery/common/img/institution/img_institution_highlights_07_1.jpg",
        buildings: [8],
        achievements: [
            "明治时代建筑教育奠基人",
            "西方建筑本土化先驱"
        ],
        achievementsJa: [
            "明治時代の建築教育の基礎",
            "西洋建築の本土化先駆"
        ]
    },
    {
        id: 9,
        name: "内藤多仲",
        nameEn: "Tachu Naito",
        nameJa: "内藤多仲",
        birthYear: 1886,
        deathYear: 1970,
        bio: "耐震建筑先驱，设计东京塔。",
        bioEn: "Pioneer of earthquake-resistant design, designed Tokyo Tower.",
        bioJa: "耐震建築の先駆者、東京タワー設計。",
        image: "https://media.gettyimages.com/id/1314853527/photo/tachu-naito-a-japanese-architect-is-considered-the-founder-of-earthquake-resistant.jpg?s=612x612&w=gi&k=20&c=JRQNT-KmJw0f8uD0GXX4TE4YkoVnfBjr_bTxHKiY4Mk=",
        buildings: [9],
        achievements: [
            "东京塔设计师",
            "耐震技术贡献"
        ],
        achievementsJa: [
            "東京タワーの設計",
            "耐震技術の貢献"
        ]
    },
    {
        id: 10,
        name: "丹下健三",
        nameEn: "Kenzo Tange",
        nameJa: "丹下健三",
        birthYear: 1913,
        deathYear: 2005,
        bio: "日本现代建筑大师，代代木体育馆设计师。",
        bioEn: "Master of modern Japanese architecture, designer of Yoyogi Gymnasium.",
        bioJa: "日本現代建築の巨匠、国立代々木競技場設計。",
        image: "https://architecture-history.org/architects/architects/TANGE/2.jpg",
        buildings: [10],
        achievements: [
            "普利兹克奖得主（1987）",
            "奥运建筑标志"
        ],
        achievementsJa: [
            "1987年プリツカー賞",
            "オリンピック建築の象徴"
        ]
    },
    {
        id: 11,
        name: "安藤忠雄",
        nameEn: "Tadao Ando",
        nameJa: "安藤忠雄",
        birthYear: 1941,
        bio: "自学成才，清水混凝土与光影大师，光之教堂与地中美术馆代表。",
        bioEn: "Self-taught, master of exposed concrete and light, Church of the Light and Chichu Art Museum.",
        bioJa: "独学のコンクリートと光の巨匠、光の教会、地中美術館。",
        image: "https://api.architectuul.org/media/4ec64056-41cc-48a1-8339-2ff86d7b5f76/1312x.jpg",
        buildings: [11, 14],
        achievements: [
            "普利兹克奖得主（1995）",
            "光影空间探索者"
        ],
        achievementsJa: [
            "1995年プリツカー賞",
            "光影空間の探求者"
        ]
    },
    {
        id: 12,
        name: "妹岛和世 & 西泽立卫 (SANAA)",
        nameEn: "Kazuyo Sejima & Ryue Nishizawa (SANAA)",
        nameJa: "妹島和世 & 西沢立衛 (SANAA)",
        birthYear: 1956, // 妹岛
        bio: "极简透明建筑代表，金泽21世纪美术馆设计师。",
        bioEn: "Masters of minimalism and transparency, designers of Kanazawa 21st Century Museum.",
        bioJa: "極簡透明建築の代表、金沢21世紀美術館設計。",
        image: "https://parametric-architecture.com/wp-content/uploads/2023/11/Kazuyo_Sejima_1.jpg", // 妹岛为主
        buildings: [12],
        achievements: [
            "普利兹克奖得主（2010）",
            "透明与开放性探索"
        ],
        achievementsJa: [
            "2010年プリツカー賞",
            "透明性と開放性の探求"
        ]
    },
    {
        id: 13,
        name: "隈研吾",
        nameEn: "Kengo Kuma",
        nameJa: "隈研吾",
        birthYear: 1954,
        bio: "木材与自然融合建筑师，东京国立竞技场设计师。",
        bioEn: "Architect integrating wood and nature, designer of Japan National Stadium.",
        bioJa: "木材と自然融合の建築家、国立競技場設計。",
        image: "https://i0.wp.com/archeyes.com/wp-content/uploads/2016/02/kengo-kuma-portrait.jpg?fit=850%2C567&ssl=1",
        buildings: [13],
        achievements: [
            "奥运主场馆设计师",
            "新和风代表"
        ],
        achievementsJa: [
            "オリンピック主競技場設計",
            "新和風の代表"
        ]
    }
]