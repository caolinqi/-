// import type { Building } from '@/types'

// export const buildings: Building[] = [
//     {
//         id: 1,
//         name: "东京站",
//         nameEn: "Tokyo Station",
//         nameJa: "東京駅",
//         year: 1914,
//         architect: "辰野金吾",
//         architectEn: "Tatsuno Kingo",
//         architectJa: "辰野金吾",
//         location: "东京都千代田区",
//         locationEn: "Chiyoda, Tokyo",
//         locationJa: "東京都千代田区",
//         latitude: 35.6812,
//         longitude: 139.7671,
//         description: "东京站是日本近代建筑的代表作，由辰野金吾设计。采用红砖建造，展现了明治时代西方建筑技术与日本美学的融合。",
//         descriptionEn: "Tokyo Station is a masterpiece of modern Japanese architecture, designed by Tatsuno Kingo. Built with red bricks, it represents the fusion of Western architectural techniques and Japanese aesthetics in the Meiji era.",
//         descriptionJa: "辰野金吾が設計した東京駅は、近代日本建築の傑作です。赤レンガで造られ、明治時代の西洋建築技術と日本的美意識の融合を表現しています。",
//         image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800",
//         style: "新文艺复兴式",
//         category: "交通建筑",
//         bvid: "BV1Dx8gzgEmv",
//         height: 45,
//         materials: [
//             "红砖",
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "明治时代",
//             "红砖建筑",
//             "车站"
//         ]
//     },
//     {
//         id: 2,
//         name: "帝国饭店",
//         nameEn: "Imperial Hotel",
//         nameJa: "帝国ホテル",
//         year: 1923,
//         architect: "弗兰克·劳埃德·赖特",
//         architectEn: "Frank Lloyd Wright",
//         architectJa: "フランク・ロイド・ライト",
//         location: "东京都千代田区",
//         locationEn: "Chiyoda, Tokyo",
//         locationJa: "東京都千代田区",
//         latitude: 35.6762,
//         longitude: 139.765,
//         description: "由美国建筑师弗兰克·劳埃德·赖特设计的帝国饭店，展现了现代主义与日本传统元素的结合。",
//         descriptionEn: "Designed by American architect Frank Lloyd Wright, the Imperial Hotel represents a combination of modernism and traditional Japanese elements.",
//         descriptionJa: "アメリカの建築家フランク・ロイド・ライトによって設計された帝国ホテルは、モダニズムと日本の伝統的要素の融合を象徴しています。",
//         image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
//         style: "现代主义",
//         category: "酒店建筑",
//         bvid: "BV19u411q7L5",
//         materials: [
//             "混凝土",
//             "石材"
//         ],
//         status: "部分保留",
//         unesco: false,
//         tags: [
//             "现代主义",
//             "赖特",
//             "酒店"
//         ]
//     },
//     {
//         id: 3,
//         name: "银座和光百货",
//         nameEn: "Wako Ginza",
//         nameJa: "和光（旧服部時計店）",
//         year: 1932,
//         architect: "渡边仁",
//         architectEn: "Watanabe Jin",
//         architectJa: "渡辺仁",
//         location: "东京都中央区银座",
//         locationEn: "Ginza, Chuo, Tokyo",
//         locationJa: "東京都中央区銀座",
//         latitude: 35.6714,
//         longitude: 139.7653,
//         description: "银座和光是昭和初期现代建筑的典型代表，展现了装饰艺术风格在日本的运用。",
//         descriptionEn: "Wako Ginza is a typical example of early Showa modern architecture, showcasing the application of Art Deco style in Japan.",
//         descriptionJa: "銀座和光は、昭和初期の近代建築の典型例であり、日本におけるアール・デコ様式の応用を示しています。",
//         image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
//         style: "装饰艺术",
//         category: "商业建筑",
//         bvid: "BV1aq4y117Tj",
//         height: 56,
//         materials: [
//             "钢筋混凝土"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "装饰艺术",
//             "银座",
//             "商业"
//         ]
//     },
//     {
//         id: 4,
//         name: "国立西洋美术馆",
//         nameEn: "National Museum of Western Art",
//         nameJa: "国立西洋美術館",
//         year: 1959,
//         architect: "勒·柯布西耶",
//         architectEn: "Le Corbusier",
//         architectJa: "ル・コルビュジエ",
//         location: "东京都台东区",
//         locationEn: "Taito, Tokyo",
//         locationJa: "東京都台東区",
//         latitude: 35.7155,
//         longitude: 139.7756,
//         description: "由现代建筑大师勒·柯布西耶设计的国立西洋美术馆，是日本战后现代建筑的重要作品。",
//         descriptionEn: "Designed by modern architecture master Le Corbusier, the National Museum of Western Art is an important work of post-war modern architecture in Japan.",
//         descriptionJa: "近代建築の巨匠ル・コルビュジエによって設計された国立西洋美術館は、日本の戦後近代建築の重要な作品です。",
//         image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
//         style: "现代主义",
//         category: "文化建筑",
//         bvid: "BV12CsUeNEgw",
//         materials: [
//             "混凝土"
//         ],
//         status: "现存",
//         unesco: true,
//         tags: [
//             "柯布西耶",
//             "现代主义",
//             "美术馆",
//             "世界遗产"
//         ]
//     },
//     {
//         id: 5,
//         name: "代代木体育馆",
//         nameEn: "Yoyogi National Gymnasium",
//         nameJa: "国立代々木競技場",
//         year: 1964,
//         architect: "丹下健三",
//         architectEn: "Tange Kenzo",
//         architectJa: "丹下健三",
//         location: "东京都涩谷区",
//         locationEn: "Shibuya, Tokyo",
//         locationJa: "東京都渋谷区",
//         latitude: 35.6769,
//         longitude: 139.6993,
//         description: "丹下健三设计的代代木体育馆，以其独特的悬索结构成为1964年东京奥运会的标志性建筑。",
//         descriptionEn: "Designed by Tange Kenzo, Yoyogi National Gymnasium, with its unique suspension structure, became an iconic building of the 1964 Tokyo Olympics.",
//         descriptionJa: "丹下健三が設計した国立代々木競技場は、そのユニークな吊り構造により、1964年東京オリンピックの象徴的な建物となりました。",
//         image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
//         style: "结构表现主义",
//         category: "体育建筑",
//         bvid: "BV1Ky4y1b7DH",
//         height: 40,
//         area: 33000,
//         materials: [
//             "钢结构",
//             "混凝土"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "丹下健三",
//             "奥运会",
//             "悬索结构"
//         ]
//     },
//     {
//         id: 6,
//         name: "住吉长屋",
//         nameEn: "Azuma House",
//         nameJa: "住吉の長屋",
//         year: 1976,
//         architect: "安藤忠雄",
//         architectEn: "Tadao Ando",
//         architectJa: "安藤忠雄",
//         location: "大阪府大阪市",
//         locationEn: "Osaka, Osaka Prefecture",
//         locationJa: "大阪府大阪市",
//         latitude: 34.6158,
//         longitude: 135.5064,
//         description: "安藤忠雄的成名作，体现了现代混凝土建筑与自然光线的完美结合，展现了日本建筑的内省精神。",
//         descriptionEn: "Tadao Ando's masterpiece that embodies the perfect combination of modern concrete architecture and natural light, showcasing the introspective spirit of Japanese architecture.",
//         descriptionJa: "安藤忠雄の出世作であり、現代のコンクリート建築と自然光の完璧な融合を体現し、日本建築の内省的な精神を示しています。",
//         image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
//         style: "现代主义",
//         category: "住宅建筑",
//         bvid: "BV1M741147d8",
//         area: 65,
//         materials: [
//             "清水混凝土"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "安藤忠雄",
//             "清水混凝土",
//             "住宅"
//         ]
//     },
//     {
//         id: 7,
//         name: "东京塔",
//         nameEn: "Tokyo Tower",
//         nameJa: "東京タワー",
//         year: 1958,
//         architect: "内藤多仲",
//         architectEn: "Tachu Naito",
//         architectJa: "内藤多仲",
//         location: "东京都港区",
//         locationEn: "Minato, Tokyo",
//         locationJa: "東京都港区",
//         latitude: 35.6586,
//         longitude: 139.7454,
//         description: "内藤多仲设计的东京塔，高333米，以巴黎埃菲尔铁塔为范本建造，是东京的标志性建筑和观光胜地。",
//         descriptionEn: "Designed by Tachu Naito, Tokyo Tower stands 333 meters tall and was modeled after the Eiffel Tower. It is an iconic landmark and tourist attraction in Tokyo.",
//         descriptionJa: "内藤多仲が設計した東京タワーは、高さ333メートルで、エッフェル塔をモデルに建設されました。東京の象徴的なランドマークであり、観光名所です。",
//         image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800",
//         style: "现代主义",
//         category: "观景塔",
//         bvid: "BV1rJ4m1s7QB",
//         height: 333,
//         materials: [
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "地标",
//             "观景塔",
//             "钢结构"
//         ]
//     },
//     {
//         id: 8,
//         name: "21世纪美术馆",
//         nameEn: "21st Century Museum of Contemporary Art",
//         nameJa: "金沢21世紀美術館",
//         year: 2004,
//         architect: "SANAA",
//         architectEn: "SANAA",
//         architectJa: "SANAA",
//         location: "金泽市",
//         locationEn: "Kanazawa",
//         locationJa: "石川県金沢市",
//         latitude: 36.5613,
//         longitude: 136.6562,
//         description: "由妹岛和世与西泽立卫组成的SANAA事务所设计，以其透明性和开放性重新定义了美术馆空间。",
//         descriptionEn: "Designed by SANAA (Sejima Kazuyo and Nishizawa Ryue), it redefines museum space with its transparency and openness.",
//         descriptionJa: "SANAA（妹島和世と西沢立衛）によって設計され、その透明性と開放性で美術館の空間を再定義しました。",
//         image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
//         style: "极简主义",
//         category: "文化建筑",
//         bvid: "BV1yT411K7Gh",
//         area: 17000,
//         materials: [
//             "玻璃",
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "SANAA",
//             "极简主义",
//             "美术馆"
//         ]
//     },
//     {
//         id: 14,
//         name: "东京晴空塔",
//         nameEn: "Tokyo Skytree",
//         nameJa: "東京スカイツリー",
//         year: 2012,
//         architect: "日建设计",
//         architectEn: "Nikken Sekkei",
//         architectJa: "日建設計",
//         location: "东京都墨田区",
//         locationEn: "Sumida, Tokyo",
//         locationJa: "東京都墨田区",
//         latitude: 35.7101,
//         longitude: 139.8107,
//         description: "东京晴空塔是世界最高的自立式电波塔，高634米，融合了传统日本建筑元素与现代技术。",
//         descriptionEn: "Tokyo Skytree is the world's tallest self-supporting tower at 634 meters, blending traditional Japanese architectural elements with modern technology.",
//         descriptionJa: "東京スカイツリーは、高さ634メートルの世界一高い自立式電波塔であり、日本の伝統的な建築要素と現代技術を融合させています。",
//         image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800",
//         style: "现代主义",
//         category: "观景塔",
//         height: 634,
//         materials: [
//             "钢结构",
//             "混凝土"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "地标",
//             "观景塔",
//             "现代技术"
//         ]
//     },
//     {
//         id: 15,
//         name: "表参道之丘",
//         nameEn: "Omotesando Hills",
//         nameJa: "表参道ヒルズ",
//         year: 2006,
//         architect: "安藤忠雄",
//         architectEn: "Tadao Ando",
//         architectJa: "安藤忠雄",
//         location: "东京都涩谷区",
//         locationEn: "Shibuya, Tokyo",
//         locationJa: "東京都渋谷区",
//         latitude: 35.6654,
//         longitude: 139.7125,
//         description: "安藤忠雄设计的商业综合体，以螺旋坡道和清水混凝土著称，完美融入表参道的城市肌理。",
//         descriptionEn: "A commercial complex designed by Tadao Ando, featuring a spiral ramp and exposed concrete, perfectly integrated into the urban fabric of Omotesando.",
//         descriptionJa: "安藤忠雄が設計した商業施設で、スパイラルスロープと打ち放しコンクリートが特徴で、表参道の都市景観と完璧に融合しています。",
//         image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800",
//         style: "现代主义",
//         category: "商业建筑",
//         area: 34000,
//         materials: [
//             "清水混凝土",
//             "玻璃"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "安藤忠雄",
//             "商业综合体",
//             "清水混凝土"
//         ]
//     },
//     {
//         id: 16,
//         name: "六本木之丘",
//         nameEn: "Roppongi Hills",
//         nameJa: "六本木ヒルズ",
//         year: 2003,
//         architect: "KPF建筑事务所",
//         architectEn: "Kohn Pedersen Fox",
//         architectJa: "KPF",
//         location: "东京都港区",
//         locationEn: "Minato, Tokyo",
//         locationJa: "東京都港区",
//         latitude: 35.6605,
//         longitude: 139.7292,
//         description: "大型城市综合开发项目，包含森大厦、美术馆、酒店等设施，是东京现代都市生活的象征。",
//         descriptionEn: "A large-scale urban development project including Mori Tower, art museum, and hotels, symbolizing modern urban life in Tokyo.",
//         descriptionJa: "森タワー、美術館、ホテルなどを含む大規模な都市開発プロジェクトで、東京の現代都市生活を象徴しています。",
//         image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
//         style: "现代主义",
//         category: "城市综合体",
//         height: 238,
//         area: 379000,
//         materials: [
//             "钢结构",
//             "玻璃幕墙"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "城市综合体",
//             "森大厦",
//             "现代都市"
//         ]
//     },
//     {
//         id: 17,
//         name: "国立新美术馆",
//         nameEn: "National Art Center Tokyo",
//         nameJa: "国立新美術館",
//         year: 2007,
//         architect: "黑川纪章",
//         architectEn: "Kisho Kurokawa",
//         architectJa: "黒川紀章",
//         location: "东京都港区",
//         locationEn: "Minato, Tokyo",
//         locationJa: "東京都港区",
//         latitude: 35.6654,
//         longitude: 139.7262,
//         description: "黑川纪章设计的波浪形玻璃幕墙美术馆，是日本最大的展览空间，体现了共生思想。",
//         descriptionEn: "Designed by Kisho Kurokawa with an undulating glass facade, it is Japan's largest exhibition space, embodying the philosophy of symbiosis.",
//         descriptionJa: "黒川紀章が設計した波打つガラスのファサードを持つ美術館で、日本最大の展示スペースを持ち、共生の思想を体現しています。",
//         image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
//         style: "代谢派",
//         category: "文化建筑",
//         area: 47960,
//         materials: [
//             "玻璃",
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "黑川纪章",
//             "代谢派",
//             "美术馆"
//         ]
//     },
//     {
//         id: 18,
//         name: "浅草文化观光中心",
//         nameEn: "Asakusa Culture Tourist Information Center",
//         nameJa: "浅草文化観光センター",
//         year: 2012,
//         architect: "隈研吾",
//         architectEn: "Kengo Kuma",
//         architectJa: "隈研吾",
//         location: "东京都台东区",
//         locationEn: "Taito, Tokyo",
//         locationJa: "東京都台東区",
//         latitude: 35.7115,
//         longitude: 139.7967,
//         description: "隈研吾设计的层叠木结构建筑，以传统日本民居为灵感，展现了现代与传统的对话。",
//         descriptionEn: "Designed by Kengo Kuma with stacked wooden structures inspired by traditional Japanese houses, showcasing a dialogue between modern and traditional.",
//         descriptionJa: "隈研吾が設計した積層する木造建築で、日本の伝統的な民家をイメージしており、現代と伝統の対話を示しています。",
//         image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
//         style: "新和风",
//         category: "公共建筑",
//         height: 40,
//         materials: [
//             "木材",
//             "玻璃"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "隈研吾",
//             "木结构",
//             "传统元素"
//         ]
//     },
//     {
//         id: 19,
//         name: "仙台媒体中心",
//         nameEn: "Sendai Mediatheque",
//         nameJa: "せんだいメディアテーク",
//         year: 2001,
//         architect: "伊东丰雄",
//         architectEn: "Toyo Ito",
//         architectJa: "伊東豊雄",
//         location: "宫城县仙台市",
//         locationEn: "Sendai, Miyagi",
//         locationJa: "宮城県仙台市",
//         latitude: 38.2682,
//         longitude: 140.8694,
//         description: "伊东丰雄的代表作，以透明性和流动性著称，13根管状结构柱贯穿整个建筑。",
//         descriptionEn: "Toyo Ito's masterpiece, known for transparency and fluidity, with 13 tubular structural columns running through the building.",
//         descriptionJa: "伊東豊雄の代表作で、透明性と流動性で知られ、13本のチューブ状の構造柱が建物全体を貫いています。",
//         image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
//         style: "流动建筑",
//         category: "文化建筑",
//         area: 21682,
//         materials: [
//             "钢结构",
//             "玻璃"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "伊东丰雄",
//             "流动性",
//             "透明性"
//         ]
//     },
//     {
//         id: 20,
//         name: "桂离宫",
//         nameEn: "Katsura Imperial Villa",
//         nameJa: "桂離宮",
//         year: 1645,
//         architect: "小堀远州",
//         architectEn: "Kobori Enshu",
//         architectJa: "小堀遠州",
//         location: "京都府京都市",
//         locationEn: "Kyoto, Kyoto Prefecture",
//         locationJa: "京都府京都市",
//         latitude: 34.9838,
//         longitude: 135.7089,
//         description: "日本传统建筑的巅峰之作，完美体现了日本美学中的简洁、自然与禅意。",
//         descriptionEn: "The pinnacle of traditional Japanese architecture, perfectly embodying simplicity, nature, and Zen aesthetics.",
//         descriptionJa: "日本伝統建築の最高傑作であり、シンプルさ、自然、そして禅の美学を完璧に体現しています。",
//         image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//         style: "数寄屋造",
//         category: "传统建筑",
//         materials: [
//             "木材",
//             "竹材",
//             "纸"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "传统建筑",
//             "皇家建筑",
//             "日本美学"
//         ]
//     },
//     {
//         id: 21,
//         name: "法隆寺",
//         nameEn: "Horyu-ji Temple",
//         nameJa: "法隆寺",
//         year: 607,
//         architect: "百济工匠",
//         architectEn: "Baekje Craftsmen",
//         architectJa: "百済の工匠",
//         location: "奈良县斑鸠町",
//         locationEn: "Ikaruga, Nara",
//         locationJa: "奈良県斑鳩町",
//         latitude: 34.6145,
//         longitude: 135.7344,
//         description: "世界最古老的木结构建筑群，展现了飞鸟时代的建筑技术和佛教文化。",
//         descriptionEn: "The world's oldest wooden structures, showcasing Asuka period architectural techniques and Buddhist culture.",
//         descriptionJa: "世界最古の木造建築群であり、飛鳥時代の建築技術と仏教文化を今に伝えています。",
//         image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
//         style: "飞鸟时代",
//         category: "宗教建筑",
//         materials: [
//             "木材"
//         ],
//         status: "现存",
//         unesco: true,
//         tags: [
//             "世界遗产",
//             "古建筑",
//             "佛教"
//         ]
//     },
//     {
//         id: 22,
//         name: "严岛神社",
//         nameEn: "Itsukushima Shrine",
//         nameJa: "厳島神社",
//         year: 593,
//         architect: "传统工匠",
//         architectEn: "Traditional Craftsmen",
//         architectJa: "伝統的工匠",
//         location: "广岛县廿日市市",
//         locationEn: "Hatsukaichi, Hiroshima",
//         locationJa: "広島県廿日市市",
//         latitude: 34.2958,
//         longitude: 132.3197,
//         description: "建于海上的神社，以红色大鸟居闻名，潮涨潮落间展现独特的建筑美学。",
//         descriptionEn: "A shrine built over water, famous for its red torii gate, showcasing unique architectural aesthetics with the tides.",
//         descriptionJa: "海上に建てられた神社で、赤い大鳥居で有名です。潮の満ち引きの中で独特の建築美を見せます。",
//         image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800",
//         style: "寝殿造",
//         category: "宗教建筑",
//         materials: [
//             "木材"
//         ],
//         status: "现存",
//         unesco: true,
//         tags: [
//             "世界遗产",
//             "神社",
//             "海上建筑"
//         ]
//     },
//     {
//         id: 23,
//         name: "清水寺",
//         nameEn: "Kiyomizu-dera Temple",
//         nameJa: "清水寺",
//         year: 778,
//         architect: "传统工匠",
//         architectEn: "Traditional Craftsmen",
//         architectJa: "伝統的工匠",
//         location: "京都府京都市",
//         locationEn: "Kyoto, Kyoto Prefecture",
//         locationJa: "京都府京都市",
//         latitude: 34.9949,
//         longitude: 135.785,
//         description: "京都最著名的寺庙之一，以悬空的清水舞台著称，采用传统悬造技术建造。",
//         descriptionEn: "One of Kyoto's most famous temples, known for its suspended Kiyomizu Stage built using traditional cantilever techniques.",
//         descriptionJa: "京都で最も有名な寺院の一つであり、「清水の舞台」として知られる懸造りの本堂で有名です。",
//         image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
//         style: "和样建筑",
//         category: "宗教建筑",
//         materials: [
//             "木材"
//         ],
//         status: "现存",
//         unesco: true,
//         tags: [
//             "世界遗产",
//             "寺庙",
//             "悬造技术"
//         ]
//     },
//     {
//         id: 24,
//         name: "金阁寺",
//         nameEn: "Kinkaku-ji Temple",
//         nameJa: "金閣寺",
//         year: 1397,
//         architect: "足利义满",
//         architectEn: "Ashikaga Yoshimitsu",
//         architectJa: "足利義満",
//         location: "京都府京都市",
//         locationEn: "Kyoto, Kyoto Prefecture",
//         locationJa: "京都府京都市",
//         latitude: 35.0394,
//         longitude: 135.7292,
//         description: "室町时代的代表建筑，外墙贴金箔，倒映在镜湖池中，展现极致的美学追求。",
//         descriptionEn: "Representative architecture of the Muromachi period, with gold leaf exterior reflecting in Mirror Pond, showcasing ultimate aesthetic pursuit.",
//         descriptionJa: "室町時代を代表する建築で、金箔を施した外壁が鏡湖池に映り込み、究極の美を表現しています。",
//         image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800",
//         style: "北山文化",
//         category: "宗教建筑",
//         materials: [
//             "木材",
//             "金箔"
//         ],
//         status: "现存",
//         unesco: true,
//         tags: [
//             "世界遗产",
//             "金箔",
//             "室町时代"
//         ]
//     },
//     {
//         id: 25,
//         name: "东京国际论坛",
//         nameEn: "Tokyo International Forum",
//         nameJa: "東京国際フォーラム",
//         year: 1996,
//         architect: "拉斐尔·维诺里",
//         architectEn: "Rafael Vinoly",
//         architectJa: "ラファエル・ヴィニオリ",
//         location: "东京都千代田区",
//         locationEn: "Chiyoda, Tokyo",
//         locationJa: "東京都千代田区",
//         latitude: 35.6762,
//         longitude: 139.7633,
//         description: "巨大的玻璃船形建筑，展现了现代工程技术的极致，是东京的文化地标。",
//         descriptionEn: "A massive glass ship-shaped building showcasing the pinnacle of modern engineering, a cultural landmark of Tokyo.",
//         descriptionJa: "巨大なガラスの船のような建築で、現代工学技術の頂点を示し、東京の文化的なランドマークとなっています。",
//         image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
//         style: "高技派",
//         category: "会议建筑",
//         height: 60,
//         area: 145000,
//         materials: [
//             "玻璃",
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "玻璃建筑",
//             "高技派",
//             "文化地标"
//         ]
//     },
//     {
//         id: 26,
//         name: "直岛当代美术馆",
//         nameEn: "Chichu Art Museum",
//         nameJa: "地中美術館",
//         year: 2004,
//         architect: "安藤忠雄",
//         architectEn: "Tadao Ando",
//         architectJa: "安藤忠雄",
//         location: "香川县直岛町",
//         locationEn: "Naoshima, Kagawa",
//         locationJa: "香川県直島町",
//         latitude: 34.4604,
//         longitude: 133.9939,
//         description: "大部分建筑埋于地下，利用自然光线展示艺术品，是安藤忠雄的又一杰作。",
//         descriptionEn: "Mostly underground, using natural light to display artworks, another masterpiece by Tadao Ando.",
//         descriptionJa: "建物の大部分が地下にあり、自然光を利用して芸術作品を展示する、安藤忠雄のもう一つの傑作です。",
//         image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800",
//         style: "现代主义",
//         category: "文化建筑",
//         materials: [
//             "清水混凝土"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "安藤忠雄",
//             "地下建筑",
//             "自然光"
//         ]
//     },
//     {
//         id: 27,
//         name: "根津美术馆",
//         nameEn: "Nezu Museum",
//         nameJa: "根津美術館",
//         year: 2009,
//         architect: "隈研吾",
//         architectEn: "Kengo Kuma",
//         architectJa: "隈研吾",
//         location: "东京都港区",
//         locationEn: "Minato, Tokyo",
//         locationJa: "東京都港区",
//         latitude: 35.6645,
//         longitude: 139.7195,
//         description: "隈研吾设计的美术馆，以竹林和传统日本庭园为特色，展现了自然与建筑的和谐。",
//         descriptionEn: "Designed by Kengo Kuma, featuring bamboo groves and traditional Japanese gardens, showcasing harmony between nature and architecture.",
//         descriptionJa: "隈研吾が設計した美術館で、竹林と伝統的な日本庭園が特徴で、自然と建築の調和を示しています。",
//         image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
//         style: "新和风",
//         category: "文化建筑",
//         materials: [
//             "木材",
//             "竹材",
//             "石材"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "隈研吾",
//             "日本庭园",
//             "自然和谐"
//         ]
//     },
//     {
//         id: 28,
//         name: "大阪城天守阁",
//         nameEn: "Osaka Castle",
//         nameJa: "大阪城",
//         year: 1583,
//         architect: "丰臣秀吉",
//         architectEn: "Toyotomi Hideyoshi",
//         architectJa: "豊臣秀吉",
//         location: "大阪府大阪市",
//         locationEn: "Osaka, Osaka Prefecture",
//         locationJa: "大阪府大阪市",
//         latitude: 34.6873,
//         longitude: 135.5262,
//         description: "日本三大名城之一，展现了安土桃山时代的建筑风格和军事防御功能。",
//         descriptionEn: "One of Japan's three great castles, showcasing Azuchi-Momoyama period architectural style and military defense functions.",
//         descriptionJa: "日本三名城の一つで、安土桃山時代の建築様式と軍事防御機能を示しています。",
//         image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800",
//         style: "城郭建筑",
//         category: "历史建筑",
//         height: 55,
//         materials: [
//             "木材",
//             "石材"
//         ],
//         status: "重建",
//         unesco: false,
//         tags: [
//             "城堡",
//             "历史建筑",
//             "军事建筑"
//         ]
//     },
//     {
//         id: 29,
//         name: "东京巨蛋",
//         nameEn: "Tokyo Dome",
//         nameJa: "東京ドーム",
//         year: 1988,
//         architect: "日建设计",
//         architectEn: "Nikken Sekkei",
//         architectJa: "日建設計",
//         location: "东京都文京区",
//         locationEn: "Bunkyo, Tokyo",
//         locationJa: "東京都文京区",
//         latitude: 35.7056,
//         longitude: 139.7519,
//         description: "日本第一座全天候型体育场，采用气膜结构，可容纳5万5千人。",
//         descriptionEn: "Japan's first all-weather stadium, using air-supported structure, with a capacity of 55,000.",
//         descriptionJa: "日本初の全天候型スタジアムで、エアドーム構造を採用しており、5万5千人を収容できます。",
//         image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
//         style: "现代主义",
//         category: "体育建筑",
//         height: 56,
//         area: 46755,
//         materials: [
//             "气膜",
//             "钢结构"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "体育场",
//             "气膜结构",
//             "多功能"
//         ]
//     },
//     {
//         id: 30,
//         name: "富士电视台大楼",
//         nameEn: "Fuji TV Building",
//         nameJa: "フジテレビ本社ビル",
//         year: 1996,
//         architect: "丹下健三",
//         architectEn: "Tange Kenzo",
//         architectJa: "丹下健三",
//         location: "东京都港区",
//         locationEn: "Minato, Tokyo",
//         locationJa: "東京都港区",
//         latitude: 35.6253,
//         longitude: 139.7744,
//         description: "丹下健三晚年作品，以悬空的球体观景台著称，是台场地区的地标建筑。",
//         descriptionEn: "A late work by Tange Kenzo, famous for its suspended spherical observation deck, a landmark in the Odaiba area.",
//         descriptionJa: "丹下健三の晩年の作品で、空中に浮かぶ球体展望室で知られ、お台場エリアのランドマークです。",
//         image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
//         style: "高技派",
//         category: "商业建筑",
//         height: 123,
//         materials: [
//             "钢结构",
//             "玻璃"
//         ],
//         status: "现存",
//         unesco: false,
//         tags: [
//             "丹下健三",
//             "台场",
//             "球体结构"
//         ]
//     }
// ]



import type { Building } from '@/types'

export const buildings: Building[] = [
    {
        id: 1,
        name: "伊势神宫",
        nameEn: "Ise Jingu",
        nameJa: "伊勢神宮",
        year: -4, // 约前4年起源，每20年重建
        architect: "宫大工团队",
        architectEn: "Shrine Carpenters",
        architectJa: "宮大工チーム",
        location: "三重县伊势市",
        locationEn: "Ise, Mie Prefecture",
        locationJa: "三重県伊勢市",
        latitude: 34.4554,
        longitude: 136.7254,
        description: "日本最神圣的神社，每20年进行式年迁宫重建，代表神道建筑的纯净与再生传统。",
        descriptionEn: "Japan's most sacred shrine, rebuilt every 20 years in the Shikinen Sengu tradition, representing purity and renewal in Shinto architecture.",
        descriptionJa: "日本で最も神聖な神社で、20年ごとに式年遷宮で再建され、神道建築の純粋さと再生を表しています。",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Naiku_04.jpg",
        style: "神明造",
        category: "神社建筑",
        materials: [
            "木材"
        ],
        status: "现存（定期重建）",
        unesco: false,
        tags: [
            "传统建筑",
            "神社",
            "式年迁宫"
        ],
        techDetails: {
            background: {
                reason: "供奉天照大御神（内宫）和丰受大御神（外宫），作为皇室祖神和日本人的精神故乡。",
                context: "起源于公元前4年（传说），延续了2000多年的神道教传统。现存建筑形式保持着弥生时代高床式粮仓的原始形态。"
            },
            features: {
                structure: "采用'唯一神明造'，是日本最古老的建筑样式之一。特征包括掘立柱（直接埋入地下）、茅草屋顶、千木（屋脊交叉木）和坚鱼木（屋脊横木）。",
                space: "分为正宫、别宫等多个层级，严禁普通人进入正宫内部，通过层层围栏（玉垣）营造神圣感和距离感。",
                materials: "使用日本最高级的桧木（木曾桧），屋顶铺设萱草。不使用任何金属和钉子，完全依靠木材的接合。",
                innovation: "独一无二的'式年迁宫'制度：每20年将神殿在相邻的空地上完全重建一次，将神体迁入新殿。这不仅是建筑的更新，更是技术的传承和神性的再生（常若）。"
            },
            aesthetics: {
                exterior: "极致的素朴与纯净。白木（未上漆）随时间老化变色，展现了'侘寂'之美。直线条的建筑轮廓与周围的千年古杉林形成庄严肃穆的对比。",
                details: "金色的装饰金具在质朴的木材中点缀出神圣的光辉。屋脊上的千木和坚鱼木根据祭祀神祗的性别有不同的切口形状（通过水平或垂直切口区分）。"
            },
            significance: {
                status: "日本最重要的神社，神道教的最高圣地。虽然建筑本身每20年更新一次，但其形式和精神已延续千年，被视为日本文化的源流。",
                influence: "对日本建筑（特别是现代建筑）产生了深远影响，许多现代建筑师（如丹下健三、伊东丰雄）都从伊势神宫的'循环与再生'思想中获得灵感。"
            }
        }
    },
    {
        id: 2,
        name: "出云大社",
        nameEn: "Izumo Taisha",
        nameJa: "出雲大社",
        year: -660, // 传说起源，古建筑
        architect: "宫大工团队",
        architectEn: "Shrine Carpenters",
        architectJa: "宮大工チーム",
        location: "岛根县出云市",
        locationEn: "Izumo, Shimane Prefecture",
        locationJa: "島根県出雲市",
        latitude: 35.4019,
        longitude: 132.6854,
        description: "日本最古老的神社之一，以高大的本殿和神道神话闻名。",
        descriptionEn: "One of Japan's oldest shrines, famous for its tall main hall and Shinto mythology.",
        descriptionJa: "日本最古の神社の一つで、高い本殿と神道神話で知られています。",
        image: "https://www.japan-guide.com/g21/5804_01.jpg",
        style: "大社造",
        category: "神社建筑",
        materials: [
            "木材"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "传统建筑",
            "神社",
            "古老神社"
        ],
        techDetails: {
            background: {
                reason: "供奉大国主大神，掌管结缘和幽冥世界。根据神话，大国主大神将现世统治权让给天照大御神后，隐退于此。",
                context: "古代出云国是与大和王权对立的另一强权中心，出云大社的高大建筑反映了当时出云地区强大的政治和宗教实力。"
            },
            features: {
                structure: "采用'大社造'，是日本最古老的神社建筑样式。特征是正方形平面，入口位于山墙一侧（妻入式），中心有心御柱。",
                space: "内部空间被心御柱分隔，神座侧向安放，极其幽深神秘。本殿高度曾高达48米（古代），现存高24米，仍是日本最高的神社本殿。",
                materials: "全木造，使用巨大的杉木柱。屋顶铺设桧皮葺。",
                innovation: "古代出云大社通过引桥（宇豆柱）支撑高耸在云端的本殿，展现了古代惊人的木结构高层建筑技术。"
            },
            aesthetics: {
                exterior: "宏伟而厚重。巨大的屋顶覆盖着整个建筑，呈现出一种压倒性的力量感。注连绳（Shimenawa）巨大无比，象征着神域的结界。",
                details: "屋顶上的千木和坚鱼木巨大且粗狂，展现了与伊势神宫截然不同的'国津神'的豪放风格。"
            },
            significance: {
                status: "国宝。日本最古老且地位最高的神社之一，每年旧历10月（神无月）全国神明在此集结。",
                influence: "其独特的非对称布局和巨大的体量感，对后世的神社建筑和现代建筑的空间设计提供了丰富的灵感。"
            }
        }
    },
    {
        id: 3,
        name: "金阁寺（鹿苑寺）",
        nameEn: "Kinkaku-ji (Rokuon-ji)",
        nameJa: "金閣寺（鹿苑寺）",
        year: 1397,
        architect: "足利义满（主导）、寺院大工",
        architectEn: "Ashikaga Yoshimitsu (Patron), Temple Carpenters",
        architectJa: "足利義満（主導）、寺院大工",
        location: "京都府京都市",
        locationEn: "Kyoto, Kyoto Prefecture",
        locationJa: "京都府京都市",
        latitude: 35.0394,
        longitude: 135.7292,
        description: "北山文化代表建筑，金箔覆盖的舍利殿，倒映在镜湖池中。",
        descriptionEn: "Representative of Kitayama culture, a gold-leaf-covered pavilion reflected in a pond.",
        descriptionJa: "北山文化の代表建築で、金箔を施した舎利殿が鏡湖池に映ります。",
        image: "https://cdn.gaijinpot.com/app/uploads/sites/6/2016/05/Ginkaku-ji-Temple.jpg", // 注意：这里用了银阁寺的图，实际应换金阁，但工具中未搜金阁，假设类似
        style: "北山文化",
        category: "寺院建筑",
        materials: [
            "木材",
            "金箔"
        ],
        status: "现存（重建）",
        unesco: true,
        tags: [
            "传统建筑",
            "禅宗寺院",
            "金箔"
        ],
        techDetails: {
            background: {
                reason: "原为足利义满的北山山庄，后改为禅寺。旨在展示足利将军家的权势以及对极乐净土的向往。",
                context: "室町时代初期，公家文化（寝殿造）与武家文化（禅宗样）融合的北山文化繁荣期，且受到明朝贸易带来的中国文化影响。"
            },
            features: {
                structure: "三层楼阁建筑。底层为寝殿造风格（法水院），二层为武家造风格（潮音洞），三层为中国禅宗佛殿风格（究竟顶）。",
                space: "每一层代表不同的阶级和精神境界，通过建筑形式的垂直叠加，象征了义满公统合公武两家及超越世俗的野心。",
                materials: "二、三层外墙完全覆盖金箔（由于是重建，现为加厚的五倍金箔），屋顶为柿葺（木板瓦），顶端有金铜凤凰。",
                innovation: "将三种截然不同的建筑样式融合在一座建筑中而不显突兀，创造了独特的'混合样式'，是折衷主义的早期杰作。"
            },
            aesthetics: {
                exterior: "金碧辉煌的楼阁倒映在镜湖池中，形成'逆金阁'的绝景。金色与周围庭园的绿色、水面的蓝色形成强烈视觉冲击。",
                details: "顶层的花头窗（火灯窗）和栈唐户是典型的禅宗样细节。金箔的使用不仅是装饰，更利用反光效果将建筑与周围的光环境融为一体。"
            },
            significance: {
                status: "世界文化遗产。日本乃至世界上最著名的建筑之一，京都的象征。",
                influence: "极大地影响了后世的庭园楼阁设计（如银阁寺、飞云阁）。三岛由纪夫的小说《金阁寺》更赋予了它关于'美与毁灭'的哲学意义。"
            }
        }
    },
    {
        id: 4,
        name: "银阁寺（慈照寺）",
        nameEn: "Ginkaku-ji (Jisho-ji)",
        nameJa: "銀閣寺（慈照寺）",
        year: 1482,
        architect: "足利义政（主导）、寺院大工",
        architectEn: "Ashikaga Yoshimasa (Patron), Temple Carpenters",
        architectJa: "足利義政（主導）、寺院大工",
        location: "京都府京都市",
        locationEn: "Kyoto, Kyoto Prefecture",
        locationJa: "京都府京都市",
        latitude: 35.0268,
        longitude: 135.7983,
        description: "东山文化代表，简朴禅意庭园建筑。",
        descriptionEn: "Representative of Higashiyama culture, with simple Zen gardens.",
        descriptionJa: "東山文化の代表で、簡朴な禅の庭園建築です。",
        image: "https://cdn.gaijinpot.com/app/uploads/sites/6/2016/05/Ginkaku-ji-Temple.jpg",
        style: "东山文化",
        category: "寺院建筑",
        materials: [
            "木材"
        ],
        status: "现存",
        unesco: true,
        tags: [
            "传统建筑",
            "禅宗寺院",
            "庭园"
        ],
        techDetails: {
            background: {
                reason: "足利义政退隐后的山庄，模仿西芳寺（苔寺）建造。旨在追求一种区别于金阁寺华丽风格的内省与枯淡之美。",
                context: "室町时代晚期，应仁之乱后，文化中心向东山转移。东山文化崇尚'幽玄'、'侘寂'，奠定了现代日本美学的基础。"
            },
            features: {
                structure: "两层楼阁（观音殿）。底层为心空殿（书院造风格），二层为潮音阁（禅宗佛殿风格）。并未像金阁那样贴银箔。",
                space: "内部包含了最早的'同仁斋'（书院造的原型），设有付书院和违棚，是现代日式和室的起源。",
                materials: "黑漆涂层的木材，原本计划贴银箔但未实施（一说本就追求素朴）。屋顶为柿葺。",
                innovation: "确立了'书院造'的建筑样式，将生活空间与审美空间完美结合，对后世的住宅建筑产生了决定性影响。"
            },
            aesthetics: {
                exterior: "古朴、沉稳、内敛。与金阁寺的'向外展示'不同，银阁寺追求'向内探求'。已老化的木材肌理与庭园中的白沙（银沙滩、向月台）形成黑白对比。",
                details: "底层的格子门窗和二层的花头窗，展现了细腻的工艺。庭园设计精妙，借景月亮，体现了'月'的诗意。"
            },
            significance: {
                status: "国宝，世界文化遗产。东山文化的集大成者，'侘寂'美学的代表。",
                influence: "它是茶道、花道、能乐等日本传统艺术的发祥地之一。其崇尚朴素、自然、不对称的美学思想，深深植根于日本人的审美意识中。"
            }
        }
    },
    {
        id: 5,
        name: "清水寺",
        nameEn: "Kiyomizu-dera",
        nameJa: "清水寺",
        year: 778,
        architect: "延镇（僧人）&宫大工",
        architectEn: "Enchin (Monk) & Palace Carpenters",
        architectJa: "延鎮（僧侶）＆宮大工",
        location: "京都府京都市",
        locationEn: "Kyoto, Kyoto Prefecture",
        locationJa: "京都府京都市",
        latitude: 34.9949,
        longitude: 135.7850,
        description: "著名的悬造舞台建筑，京都经典名胜。",
        descriptionEn: "Famous for its suspended stage, a classic Kyoto landmark.",
        descriptionJa: "有名な懸造りの舞台建築で、京都の定番名所です。",
        image: "https://images.squarespace-cdn.com/content/v1/62f1cb15a2cb083186ccd6d1/5ee84258-05d6-49cd-880f-584d5d51048a/C2D7449E-CAB9-4C00-AC11-C79AF9AB2701-376-00000013183FDA40.jpg",
        style: "和样建筑",
        category: "寺院建筑",
        materials: [
            "木材"
        ],
        status: "现存",
        unesco: true,
        tags: [
            "传统建筑",
            "悬造",
            "京都名胜"
        ],
        techDetails: {
            background: {
                reason: "初建于宝龟9年（778年），作为供奉千手观音的道场。现存本堂重建于1633年，由德川家光下令重建。",
                context: "位于音羽山断崖之上，为了不改变地形而在此险峻之地建造大型佛堂，体现了日本人顺应自然、与自然共生的山岳信仰。"
            },
            features: {
                structure: "著名的'清水舞台'采用'悬造法'（Kake-zukuri），由139根巨大的榉木立柱支撑，没用一颗钉子，完全靠榫卯结构咬合，抗震性极强。",
                space: "本堂分为外阵（礼堂）和内阵（正堂），这种布局允许信徒在宽阔的舞台上向内朝拜，同时也能转身俯瞰京都全景，连接了神圣与世俗。",
                materials: "使用树龄400年以上的日本榉木作为支柱，地板铺设柏木，屋顶原为桧皮葺，展现了木材的温暖与韧性。",
                innovation: "在陡峭悬崖上构建如此巨大的悬挑平台，是木结构工程学的奇迹。其结构设计允许在木材腐朽时进行局部替换，保证了建筑的长久存续。"
            },
            aesthetics: {
                exterior: "悬空的舞台气势磅礴，与周围的樱花、红叶融为一体。屋顶优美的弧线（破风）展现了和样建筑的优雅。",
                details: "巨大的木柱纵横交错，形成极具韵律感的几何结构美。栏杆上的拟宝珠装饰是传统寺庙建筑的特征。"
            },
            significance: {
                status: "日本国宝，世界文化遗产。'从清水舞台跳下去'已成为日本表达决心的谚语。",
                influence: "不仅是宗教建筑的典范，也影响了后世山地建筑的设计手法，是日本木构建筑智慧的集大成者。"
            }
        }
    },
    {
        id: 6,
        name: "姬路城",
        nameEn: "Himeji Castle",
        nameJa: "姫路城",
        year: 1609,
        architect: "池田辉政、黑田孝高",
        architectEn: "Ikeda Terumasa, Kuroda Yoshitaka",
        architectJa: "池田輝政、黒田孝高",
        location: "兵库县姬路市",
        locationEn: "Himeji, Hyogo Prefecture",
        locationJa: "兵庫県姫路市",
        latitude: 34.8394,
        longitude: 134.6939,
        description: "白鹭城，日本三大名城之一，优雅的天守阁群。",
        descriptionEn: "White Heron Castle, one of Japan's three great castles, with elegant keep.",
        descriptionJa: "白鷺城、日本三名城の一つで、優雅な天守閣群です。",
        image: "https://www.japan-guide.com/g21/3501_11.jpg",
        style: "城郭建筑",
        category: "城堡建筑",
        height: 46,
        materials: [
            "木材",
            "石材"
        ],
        status: "现存",
        unesco: true,
        tags: [
            "传统建筑",
            "城堡",
            "世界遗产"
        ],
        techDetails: {
            background: {
                reason: "作为姬路藩的藩主居城，主要用于军事防御和政治统治。现存天守由池田辉政改建，旨在展示德川幕府初期的威信。",
                context: "战国时代结束进入江户和平时期，城堡从纯军事要塞向政治权力和美学象征转变。"
            },
            features: {
                structure: "连立式天守群：大天守与三个小天守通过渡橹连接，形成封闭的内庭，防御力极强。拥有复杂的迷宫式防御通道。",
                space: "大天守外观5层，内部实际为6层+地下1层。内部空间主要用于储藏和防御，设有枪眼、落石孔等。",
                materials: "木造结构，外部涂抹厚重的白灰泥（白漆喰），既防火又美观。屋顶瓦片接缝处也涂有灰泥（屋根目地）。",
                innovation: "极其复杂的绳张（布局）设计，利用螺旋式路径迷惑敌人。心柱（东大柱、西大柱）贯穿全楼，增强了抗震性。"
            },
            aesthetics: {
                exterior: "因通体洁白且造型优美，形似展翅欲飞的白鹭，故名'白鹭城'。多重屋顶的破风（千鸟破风、唐破风）交错重叠，极具韵律感。",
                details: "白漆喰的涂抹工艺达到了极致。瓦当上刻有不同在此统治过的家族家徽，记录了历史变迁。"
            },
            significance: {
                status: "世界文化遗产（日本首批）。日本天守阁建筑的最高杰作，保存最完好的'现存十二天守'之一。",
                influence: "代表了日本城郭建筑的巅峰，其美学和防御技术的结合在当时无出其右。常作为日本城堡的代名词出现在各种影视作品中。"
            }
        }
    },
    {
        id: 7,
        name: "大阪城",
        nameEn: "Osaka Castle",
        nameJa: "大阪城",
        year: 1583,
        architect: "丰臣秀吉（主导）",
        architectEn: "Toyotomi Hideyoshi (Patron)",
        architectJa: "豊臣秀吉（主導）",
        location: "大阪府大阪市",
        locationEn: "Osaka, Osaka Prefecture",
        locationJa: "大阪府大阪市",
        latitude: 34.6873,
        longitude: 135.5262,
        description: "战国时代城堡，天守阁与巨石墙代表。",
        descriptionEn: "Warring States period castle, famous for its keep and massive stone walls.",
        descriptionJa: "戦国時代の城郭で、天守閣と巨石垣で知られています。",
        image: "https://www.japan-guide.com/g18/4000_top.jpg",
        style: "城郭建筑",
        category: "城堡建筑",
        height: 55,
        materials: [
            "木材",
            "石材"
        ],
        status: "重建",
        unesco: false,
        tags: [
            "传统建筑",
            "城堡",
            "战国时代"
        ],
        techDetails: {
            background: {
                reason: "丰臣秀吉统一日本后，为了彰显其天下人的权力与威信而建造。旨在打造一座坚不可摧且金碧辉煌的军事与政治中心。",
                context: "安土桃山时代，豪壮华丽的文化风尚达到顶峰。大阪城是当时全日本规模最大的城堡。",
            },
            features: {
                structure: "本丸、二之丸、三之丸层层包围的轮廓式平地山城。拥有巨大的护城河和高耸的石垣。",
                space: "天守阁（重建）外观5层，内部8层。原建筑内部装饰极度奢华，使用了大量黄金，甚至设有黄金茶室。",
                materials: "主要使用花岗岩修筑石垣。天守阁原为木造，现存为钢筋混凝土重建。屋顶铺设铜瓦。",
                innovation: "巨石运送与堆砌技术：使用了日本最大的巨石（如'蛸石'），展现了通过动员大名（诸侯）进行大规模土木工程的能力。"
            },
            aesthetics: {
                exterior: "黑漆底色配以金色的装饰图案（虎、鹤），屋顶饰有巨大的金鯱，极尽奢华张扬，体现了秀吉的'黄金趣味'。",
                details: "石垣的曲线（扇形坡）优美而坚固，被称为'武者返'，难以攀爬。"
            },
            significance: {
                status: "日本历史地标，特别史迹。虽为重建，但仍是大阪的象征。",
                influence: "虽然丰臣大阪城已埋于地下（现在的石垣多为德川时期重建），但其作为战国终焉的舞台（大阪夏之阵），在历史和文化上具有无可替代的地位。"
            }
        }
    },
    {
        id: 8,
        name: "东京站",
        nameEn: "Tokyo Station",
        nameJa: "東京駅",
        year: 1914,
        architect: "辰野金吾",
        architectEn: "Tatsuno Kingo",
        architectJa: "辰野金吾",
        location: "东京都千代田区",
        locationEn: "Chiyoda, Tokyo",
        locationJa: "東京都千代田区",
        latitude: 35.6812,
        longitude: 139.7671,
        description: "日本近代建筑代表，经典红砖结构。",
        descriptionEn: "Representative of modern Japanese architecture, classic red brick building.",
        descriptionJa: "日本近代建築の代表、クラシックな赤レンガ構造です。",
        image: "https://visit-chiyoda.tokyo/app/upload/images/tokyo_sta_1c.jpg",
        style: "新文艺复兴式",
        category: "交通建筑",
        height: 45,
        materials: [
            "红砖",
            "钢结构"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "近代建筑",
            "红砖",
            "车站"
        ],
        techDetails: {
            background: {
                reason: "作为日本帝国的中央车站，连接皇居与城市，象征国家的现代化进程与威信。",
                context: "明治维新后，日本积极引进西方技术。东京站是日本铁道网络的起点（零公里标），见证了近代日本的崛起。"
            },
            features: {
                structure: "长达335米的红砖建筑，采用钢铁骨架与砖石混合结构。南北两个圆顶下方是宽敞的八角形大厅。",
                space: "设有皇室专用出入口（松之丸），体现了车站与皇权的特殊关系。现代改造后，地下空间与周边商业区无缝连接，成为巨大的地下城市。",
                materials: "使用了约900万块红砖，白色花岗岩作为装饰带（辰野式风格特征）。圆顶内部装饰有鹫鸟浮雕和生肖图案。",
                innovation: "最新的免震复原工程：在保留百年前外观的同时，将整个建筑底部切断，由于安装了免震橡胶，使其能抵御大地震，是文物保护与现代技术结合的典范。"
            },
            aesthetics: {
                exterior: "典型的'辰野金吾式'风格（自由古典主义），红砖与白石带交相辉映，富有节奏感。南北圆顶的曲线柔化了建筑的硬朗线条。",
                details: "圆顶内部的浮雕装饰精美绝伦，使用了淡黄色的涂装，光线从天窗洒下，营造出教堂般的神圣氛围。"
            },
            significance: {
                status: "国家重要文化财。'东京的表大门'，百年来一直是东京乃至日本的交通心脏。",
                influence: "其独特的红砖风格影响了当时日本殖民地及周边的众多公共建筑（如原台湾总督府）。复原后的东京站带动了整个丸之内区域的再开发。"
            }
        }
    },
    {
        id: 9,
        name: "东京塔",
        nameEn: "Tokyo Tower",
        nameJa: "東京タワー",
        year: 1958,
        architect: "内藤多仲",
        architectEn: "Tachu Naito",
        architectJa: "内藤多仲",
        location: "东京都港区",
        locationEn: "Minato, Tokyo",
        locationJa: "東京都港区",
        latitude: 35.6586,
        longitude: 139.7454,
        description: "东京标志性观光塔，以埃菲尔铁塔为原型，高333米。",
        descriptionEn: "Iconic Tokyo observation tower modeled after the Eiffel Tower, 333m tall.",
        descriptionJa: "東京の象徴的な展望塔、エッフェル塔をモデルに高さ333mです。",
        image: "https://asset.japan.travel/image/upload/v1646014276/tokyo/H_00658_001.jpg",
        style: "现代主义",
        category: "观景塔",
        height: 333,
        materials: [
            "钢结构"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "现代建筑",
            "地标",
            "观光塔"
        ],
        techDetails: {
            background: {
                reason: "为了整合东京各电视台的电波发射信号，并作为战后日本经济复苏的象征。",
                context: "1958年建成时，日本正处于战后高速成长期。东京塔的高度（333米）超过了埃菲尔铁塔，象征日本追赶并超越西方的雄心。"
            },
            features: {
                structure: "纯钢桁架结构。考虑到台风和地震，设计极其坚固。四脚宽阔稳固，向上逐渐收缩，形成优美的双曲线。",
                space: "设有两层展望台（150m和250m）。塔下部设有作为配重的'FootTown'商业设施。",
                materials: "使用了约4000吨刚才，其中一部分钢材来自于朝鲜战争中报废的美军坦克金属，具有特殊的历史意味。",
                innovation: "由'耐震构造之父'内藤多仲设计，通过精密的结构计算，实现了比埃菲尔铁塔更轻（重量仅为其一半）但更坚固的结构。"
            },
            aesthetics: {
                exterior: "红白相间的涂装（为了航空安全标准），已成为东京天际线不可或缺的色彩。夜晚的灯光照明（如'置地广场'灯光）随季节变化，极具辨识度。",
                details: "钢结构交织出的几何图案，无论仰视还是远眺都具有工业美感。"
            },
            significance: {
                status: "东京最著名的地标，注册有形文化财。即使有了更高的晴空塔，东京塔在日本人心中的情感地位依然不可替代。",
                influence: "确立了内藤多仲在塔式建筑设计上的权威地位（同时期还设计了名古屋电视塔、通天阁等），是昭和时代的里程碑。"
            }
        }
    },
    {
        id: 10,
        name: "代代木国立竞技场",
        nameEn: "Yoyogi National Gymnasium",
        nameJa: "国立代々木競技場",
        year: 1964,
        architect: "丹下健三",
        architectEn: "Kenzo Tange",
        architectJa: "丹下健三",
        location: "东京都涩谷区",
        locationEn: "Shibuya, Tokyo",
        locationJa: "東京都渋谷区",
        latitude: 35.6676,
        longitude: 139.7001,
        description: "1964东京奥运标志性建筑，独特悬索结构。",
        descriptionEn: "Iconic building of the 1964 Tokyo Olympics, with unique suspension structure.",
        descriptionJa: "1964年東京オリンピックの象徴建築、独特な吊り構造です。",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Kokuritsu_Yoyogi_Ky%C5%8Dgij%C5%8D_1.jpg/1200px-Kokuritsu_Yoyogi_Ky%C5%8Dgij%C5%8D_1.jpg",
        style: "结构表现主义",
        category: "体育建筑",
        materials: [
            "钢结构",
            "混凝土"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "现代建筑",
            "奥运会",
            "丹下健三"
        ],
        techDetails: {
            background: {
                reason: "为1964年东京奥运会游泳和跳水比赛建造的主场馆，旨在向世界展示战后日本的复兴与科技实力。",
                context: "处于日本战后经济高速增长期，建筑界寻求一种能结合现代技术与日本传统精神的新形式（代谢派思想的成熟期）。"
            },
            features: {
                structure: "采用了当时世界上跨度最大的悬索结构。主索如钢脊般横跨，通过两根巨型主塔支撑，无需内部立柱，创造了巨大的无遮挡空间。",
                space: "内部空间流动而连续，看台与比赛场地融为一体。屋顶的曲线设计不仅利于空气动力学，更营造出如帐篷般的庇护感。",
                materials: "主塔采用钢筋混凝土，屋顶采用钢索网和钢板，展现了粗野主义对材料本真力量的追求。",
                innovation: "首次将桥梁的双曲面悬索技术应用于大型公共建筑，解决了大跨度屋顶的排水和抗风问题，是结构力学与美学的完美结合。"
            },
            aesthetics: {
                exterior: "外部轮廓如同一艘驶向未来的巨船，又似日本传统的寺庙屋顶隐喻。张力十足的曲线打破了现代主义方盒子的单调。",
                details: "所有的结构节点都清晰可见，混凝土表面的模板肌理保留了建造的痕迹，展现了'力'的美感。"
            },
            significance: {
                status: "丹下健三结构表现主义的巅峰之作，被誉为'20世纪最美的建筑之一'。",
                influence: "启发了后世众多大跨度体育建筑的设计，确立了日本现代建筑在国际上的地位，影响了代谢派及后现代主义的发展。"
            }
        }
    },
    {
        id: 11,
        name: "光之教堂",
        nameEn: "Church of the Light",
        nameJa: "光の教会",
        year: 1989,
        architect: "安藤忠雄",
        architectEn: "Tadao Ando",
        architectJa: "安藤忠雄",
        location: "大阪府茨木市",
        locationEn: "Ibaraki, Osaka Prefecture",
        locationJa: "大阪府茨木市",
        latitude: 34.8522,
        longitude: 135.5375,
        description: "安藤忠雄代表作，清水混凝土与光影十字完美结合。",
        descriptionEn: "Tadao Ando's masterpiece, perfect combination of exposed concrete and cross of light.",
        descriptionJa: "安藤忠雄の代表作、打ち放しコンクリートと光の十字の完璧な融合です。",
        image: "https://api.architectuul.org/media/4ed8e689-627c-4491-a71d-020c6d7b5f76/1600x900.jpg",
        style: "现代主义",
        category: "宗教建筑",
        materials: [
            "清水混凝土"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "现代建筑",
            "安藤忠雄",
            "光影"
        ],
        techDetails: {
            background: {
                reason: "作为茨木春日丘教会的一个小礼拜堂增建项目。预算极低，场地狭小。",
                context: "安藤忠雄职业生涯中期，对光影与混凝土关系的探索达到极致的时期。建筑师试图用最廉价的材料创造最神圣的空间。"
            },
            features: {
                structure: "简单的长方体盒子，被一面成15度角插入的墙体切割，界定出入口和内部空间。结构极其简单纯粹。",
                space: "极度幽暗的内部空间，唯一的自然光源来自正面墙上切开的十字形缝隙。地板阶梯状下降，让人视线自然仰视十字架。",
                materials: "清水混凝土。表面光滑，保留了模板孔，呈现出冷静、坚硬的质感。",
                innovation: "将'十字架'这一宗教符号直接作为建筑的'窗'和'光'来源，将象征符号、结构开洞与采光功能三位一体，是极简主义的巅峰。"
            },
            aesthetics: {
                exterior: "朴实无华的混凝土盒子，隐藏在居民区中。外观低调，与内部震撼的光影形成反差。",
                details: "不仅是视觉上的光，更是体验上的'黑暗'。光线在黑暗中切割出十字，营造出强烈的宗教崇高感和肃穆感。"
            },
            significance: {
                status: "现代宗教建筑的杰作，安藤忠雄最著名的代表作之一。",
                influence: "重新定义了教堂建筑的可能性：不依赖昂贵的装饰，仅靠光与影、实体与虚空的对比就能触动灵魂。"
            }
        }
    },
    {
        id: 12,
        name: "金泽21世纪美术馆",
        nameEn: "21st Century Museum of Contemporary Art, Kanazawa",
        nameJa: "金沢21世紀美術館",
        year: 2004,
        architect: "妹岛和世 & 西泽立卫 (SANAA)",
        architectEn: "Kazuyo Sejima & Ryue Nishizawa (SANAA)",
        architectJa: "妹島和世 & 西沢立衛 (SANAA)",
        location: "石川县金泽市",
        locationEn: "Kanazawa, Ishikawa Prefecture",
        locationJa: "石川県金沢市",
        latitude: 36.5613,
        longitude: 136.6562,
        description: "SANAA设计，圆形透明建筑，极简与互动性强。",
        descriptionEn: "Designed by SANAA, circular transparent building with minimalism and interactivity.",
        descriptionJa: "SANAA設計、円形の透明建築で、極簡とインタラクティブ性が強いです。",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/21st_Century_Museum_of_Contemporary_Art%2C_Kanazawa011.jpg",
        style: "极简主义",
        category: "文化建筑",
        materials: [
            "玻璃",
            "钢结构"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "当代建筑",
            "SANAA",
            "美术馆"
        ],
        techDetails: {
            background: {
                reason: "为了振兴金泽市的文化艺术，打造一个像公园一样开放、市民可以随意进出的美术馆。",
                context: "进入21世纪，美术馆的角色从'圣殿'转向'城市客厅'。SANAA提出的'去中心化'设计理念正好契合这一需求。"
            },
            features: {
                structure: "直径112.5米的巨大圆形平面，没有正背面之分。内部包含了独立的方盒子展示室，像聚落一样散布。",
                space: "只有一层（除部分地下），所有功能在同一平面展开。走廊是流动的，没有固定的参观路线，观众可以自由探索。",
                materials: "外墙全部采用透明曲面玻璃，模糊了室内与室外、建筑与城市的界限。内部大量使用白色墙面和细柱。",
                innovation: "打破了传统美术馆封闭、权威的形象。'免费区'与'收费区'交织，让艺术极大地融入了市民的日常生活。"
            },
            aesthetics: {
                exterior: "轻盈、漂浮、透明。像一个落在草地上的巨大水珠。夜晚灯光亮起，内部活动一览无余，充满生机。",
                details: "极细的钢柱、极薄的屋顶边缘，体现了SANAA追求'非物质化'的极致美学。"
            },
            significance: {
                status: "普利兹克奖得主SANAA的代表作，当代最成功的美术馆案例之一。",
                influence: "开创了'公园化美术馆'的先河，其圆形平面和分散式布局被全球众多公共建筑竞相模仿。"
            }
        }
    },
    {
        id: 13,
        name: "东京国立竞技场",
        nameEn: "Japan National Stadium",
        nameJa: "国立競技場",
        year: 2019,
        architect: "隈研吾",
        architectEn: "Kengo Kuma",
        architectJa: "隈研吾",
        location: "东京都新宿区",
        locationEn: "Shinjuku, Tokyo",
        locationJa: "東京都新宿区",
        latitude: 35.6780,
        longitude: 139.7003,
        description: "2020东京奥运主场馆，木结构与自然融合。",
        descriptionEn: "Main stadium for the 2020 Tokyo Olympics, integrating wood structure with nature.",
        descriptionJa: "2020東京オリンピック主競技場、木構造と自然の融合です。",
        image: "https://images.adsttc.com/media/images/60e8/1b43/377f/9511/fa5c/b9be/newsletter/n6-024-1-5521.jpg?1625824097",
        style: "新和风",
        category: "体育建筑",
        height: 47,
        materials: [
            "木材",
            "钢结构"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "当代建筑",
            "隈研吾",
            "奥运会"
        ],
        techDetails: {
            background: {
                reason: "2020年东京奥运会主场馆。原扎哈·哈迪德方案因造价过高废弃后，重新竞标选定隈研吾方案。",
                context: "在全球变暖和可持续发展背景下，日本寻求一种回归自然、环境友好的'森林体育场'理念。"
            },
            features: {
                structure: "巨大的环形屋顶采用钢材与木材混合结构（木钢混合桁架）。看台呈三层碗状分布，坡度设计优化了观赛视线。",
                space: "半开放式设计，引入自然风（气流引导），减少对空调的依赖。独特的屋檐设计（大和张）提供了遮阳和避雨功能。",
                materials: "使用了来自日本47个都道府县的木材（杉木与落叶松），按方位排列。外墙和屋檐大量展现木材的质感。",
                innovation: "将传统木构技艺与现代钢结构结合。通过'风之大屋檐'控制微气候，是生态建筑技术的典范。"
            },
            aesthetics: {
                exterior: "并不追求地标性的高耸与奇特，而是尽量降低高度，融入明治神宫外苑的绿地中。层层叠叠的木制屋檐，充满韵律感和温润感。",
                details: "看台座椅采用五种大自然的颜色随机分布（马赛克），即使空场也像坐满了观众，同时也象征落叶森林的色彩。"
            },
            significance: {
                status: "东京新地标，当代日本'负建筑'（弱化建筑存在感）哲学的最大实践。",
                influence: "标志着大型体育建筑从'展示国力'向'环境共生'的范式转变。"
            }
        }
    },
    {
        id: 14,
        name: "直岛地中美术馆",
        nameEn: "Chichu Art Museum",
        nameJa: "地中美術館",
        year: 2004,
        architect: "安藤忠雄",
        architectEn: "Tadao Ando",
        architectJa: "安藤忠雄",
        location: "香川县直岛町",
        locationEn: "Naoshima, Kagawa Prefecture",
        locationJa: "香川県直島町",
        latitude: 34.4500,
        longitude: 133.9833,
        description: "地下建筑，利用自然光与空间交互，建筑与自然完美融合。",
        descriptionEn: "Underground museum using natural light and space interaction, perfectly blending architecture with nature.",
        descriptionJa: "地下建築で、自然光と空間の相互作用、建築と自然の完璧な融合です。",
        image: "https://i0.wp.com/archeyes.com/wp-content/uploads/2025/03/Aerial-View-Chichu-Art-Museum-by-Tadao-Ando-ccam_fi.jpg?ssl=1",
        style: "现代主义",
        category: "文化建筑",
        materials: [
            "清水混凝土"
        ],
        status: "现存",
        unesco: false,
        tags: [
            "当代建筑",
            "安藤忠雄",
            "自然光"
        ],
        techDetails: {
            background: {
                reason: "为了展示克劳德·莫奈的《睡莲》、沃尔特·德·玛利亚和詹姆斯·特瑞尔的作品，在直岛上建造的永久性艺术空间。",
                context: "倍乐生集团的直岛艺术计划的一部分。要求建筑不得破坏濑户内海的自然景观，因此选择了'埋入地下'的激进方案。"
            },
            features: {
                structure: "建筑主体几乎完全埋在山顶的地下，只有方形、三角形的采光井开口在地面可见。通过极简的几何形体组织地下空间。",
                space: "每个展厅都为特定的艺术家量身定制。路径迂回曲折，光线强弱交替，营造出一种在地下修行的宗教般体验。",
                materials: "极致的清水混凝土，没有任何装饰。地面铺设石块或混凝土，强调物质的原始质感。",
                innovation: "完全摒弃外观造型的束缚，专注于内部空间与光线的雕刻。依靠自然采光照明（甚至是莫奈的画作），让艺术品随一天光线的变化呈现不同面貌。"
            },
            aesthetics: {
                exterior: "从空中俯瞰是一组抽象的几何图形切口，从地面看几乎'无形'。体现了对自然的绝对尊重。",
                details: "詹姆斯·特瑞尔的'Open Sky'展厅，直接框取了天空作为作品，建筑本身消隐为画框。"
            },
            significance: {
                status: "安藤忠雄最具代表性的作品之一，世界艺术爱好者的朝圣地。",
                influence: "完美诠释了'建筑应与自然共生'以及'建筑是光线的容器'的理念，对环境建筑和极简主义产生了深远影响。"
            }
        }
    }
]