export default {
    nav: {
        home: 'Home',
        timeline: 'Timeline',
        architect: 'Architects',
        map: 'Map',
        favorites: 'Favorites',
        archive: 'Archive',
        dialogue: 'Dialogue',
        statistics: 'Statistics',
        tours: 'Tours',
        quiz: 'Quiz',
        learning: 'Learning Center'
    },
    learning: {
        title: 'Learning Center',
        subtitle: 'Complete missions, level up, and unlock architect badges',
        level: 'LEVEL',
        exp: 'EXP',
        badges: 'BADGE WALL',
        modules: 'TRAINING MODULES',
        completed: 'COMPLETED',
        start: 'START MISSION',
        locked: 'LOCKED',
        titles: {
            novice: 'Novice Architect',
            builder: 'Junior Builder',
            historian: 'Historian',
            visionary: 'Visionary'
        },
        quiz: {
            title: 'Architectural Quiz',
            desc: 'Test your knowledge of modern Japanese architecture',
            question: 'Question',
            correct: 'Correct!',
            wrong: 'Incorrect',
            score: 'Score',
            complete: 'Mission Complete'
        },
        puzzle: {
            title: 'Construction Puzzle',
            desc: 'Drag correct materials to the matching architect',
            instruction: 'Drag material to the matching architect portrait',
            match: 'Match!',
            mismatch: 'Try Again',
            complete: 'Puzzle Complete'
        }
    },
    common: {
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        reset: 'Reset',
        loading: 'Loading...',
        noData: 'No data',
        total: 'Total',
        items: 'items'
    },
    map: {
        title: 'Architectural Map Explorer',
        subtitle: 'Discover the locations of {count} buildings',
        buildingList: 'Building List',
        searchPlaceholder: '🔍 Search by building name, architect...',
        keyboardHint: 'Use ↑↓ keys to browse quickly',
        flyingTo: 'Flying to target...',
        resetView: 'Reset View',
        buildingCount: 'Total Buildings',
        favoriteCount: 'Favorites',
        emptySearch: 'No matching buildings found',
        emptyHint: 'Try different keywords',
        locations: 'LOCATIONS',
        tracesDetected: 'ARCH TRACES DETECTED',
        viewArchive: 'VIEW ARCHIVE',
        establishingLink: 'ESTABLISHING SATELLITE LINK...'
    },
    home: {
        title: 'Modern Japanese Architecture Explorer',
        subtitle: 'Discover the history and aesthetics of Japanese architecture',
        explore: 'Explore Now',
        stats: {
            buildings: 'Buildings',
            architects: 'Architects',
            favorites: 'Favorites'
        },
        featured: 'Featured Buildings',
        selectedWorks: 'Selected Works',
        featuredLabel: 'FEATURED',
        quote: 'Architectural Quotes',
        features: {
            timeline: 'Explore architectural history and architects through a chronological timeline.',
            map: 'View building locations on a Gaode Map with clear geographic visualization.',
            favorites: 'Save your favorite buildings and view them anytime.'
        }
    },
    timeline: {
        title: 'Architecture Timeline',
        subtitle: 'Explore the evolution of Japanese architecture through time',
        year: 'Year'
    },
    architect: {
        title: 'Architects',
        subtitle: 'Explore the masters who shaped Japanese architecture',
        works: 'Works',
        viewWorks: 'View Works',
        achievements: 'Achievements'
    },
    favorites: {
        title: 'My Favorites',
        subtitle: 'Your saved buildings',
        empty: 'No buildings favorited yet',
        emptyHint: 'Browse and tap the star to save favorites',
        total: 'Total Favorites'
    },
    building: {
        year: 'Year',
        architect: 'Architect',
        location: 'Location',
        style: 'Style',
        category: 'Category',
        height: 'Height',
        area: 'Area',
        materials: 'Materials',
        status: 'Status',
        unesco: 'UNESCO Site',
        viewDetails: 'View Details',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove Favorite',
        description: 'Description',
        relatedVideo: 'Related Video'
    },
    theme: {
        light: 'Light Mode',
        dark: 'Dark Mode',
        toggle: 'Toggle Theme'
    },
    language: {
        zhCN: '简体中文',
        enUS: 'English',
        jaJP: '日本語'
    },
    statistics: {
        title: 'Data Statistics',
        subtitle: 'Visual analysis of building dataset',
        yearDistribution: 'Year Distribution',
        styleDistribution: 'Style Distribution',
        categoryDistribution: 'Category Distribution',
        architectWorks: 'Architect Work Statistics',
        totalBuildings: 'Total Buildings',
        totalArchitects: 'Total Architects',
        avgYear: 'Average Year',
        oldestBuilding: 'Oldest Building',
        newestBuilding: 'Newest Building',
        unescoCount: 'UNESCO Sites Count'
    },
    tours: {
        title: 'Virtual Tours',
        subtitle: 'Explore curated architectural routes',
        presetTours: 'Featured Routes',
        myTours: 'My Routes',
        createTour: 'Create Route',
        viewTour: 'View Route',
        startTour: 'Start Tour',
        duration: 'Duration',
        stops: 'Stops',
        difficulty: 'Difficulty',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        tourList: {
            1: { name: 'World Heritage Journey', description: 'Visit Japan\'s most precious architectural treasures and experience the charm of World Heritage Sites.' },
            2: { name: 'Traditional Architecture Discovery', description: 'Deep dive into the essence of Japanese traditional architecture and experience classical aesthetics.' },
            3: { name: 'Modern Architecture Pilgrimage', description: 'Experience the innovation and avant-garde of modern Japanese architecture and witness artistic evolution.' },
            4: { name: 'Masters\' Works Tour', description: 'Follow in the footsteps of architectural masters and admire masterpieces by Tadao Ando, Kenzo Tange, and others.' },
            5: { name: 'Tokyo Architecture Highlights', description: 'Tour Tokyo\'s most iconic buildings and feel the charm of urban architecture.' },
            6: { name: 'Kyoto Ancient Architecture Tour', description: 'Stroll through Kyoto and visit the architectural heritage of the thousand-year capital.' }
        }
    },
    quiz: {
        title: 'Architecture Quiz',
        subtitle: 'Test your knowledge and challenge your score',
        startQuiz: 'Start Quiz',
        nextQuestion: 'Next Question',
        submit: 'Submit',
        viewResult: 'View Result',
        playAgain: 'Play Again',
        score: 'Score',
        correct: 'Correct',
        incorrect: 'Incorrect',
        accuracy: 'Accuracy',
        totalQuestions: 'Total Questions',
        answeredQuestions: 'Answered',
        difficulty: {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard'
        },
        selectDifficulty: 'Select Difficulty',
        questionType: {
            single: 'Single Choice',
            multiple: 'Multiple Choice',
            judge: 'True/False'
        },
        congratulations: 'Congratulations!',
        tryAgain: 'Try Again!',
        perfect: 'Perfect!',
        excellent: 'Excellent!',
        good: 'Good!',
        needImprovement: 'Needs Improvement'
    },
    footer: {
        copyright: 'Modern Japanese Architecture Guide © 2025',
        source: 'Based on the "Modern Japanese Architecture" chapter in *General Studies: Fields of Knowledge*'
    },
    archive: {
        title: 'Confidential Architectural Archive',
        totalRecords: 'Total Records',
        searchPlaceholder: 'Search ID, Name or Architect...',
        filters: {
            status: 'Status',
            material: 'Material',
            era: 'Era'
        },
        columns: {
            id: 'ID',
            name: 'Name',
            architect: 'Architect',
            year: 'Year',
            location: 'Location',
            material: 'Material'
        },
        status: {
            Extant: 'Extant',
            Demolished: 'Demolished',
            Reconstructed: 'Reconstructed',
            Relocated: 'Relocated'
        },
        era: {
            Meiji: 'Meiji',
            Taisho: 'Taisho',
            Showa: 'Showa',
            Heisei: 'Heisei'
        }
    },
    dialogue: {
        metrics: {
            height: 'Height',
            history: 'History',
            innovation: 'Innovation',
            complexity: 'Complexity',
            aesthetics: 'Aesthetics',
            impact: 'Impact'
        },
        fields: {
            year: 'Year Built',
            architect: 'Architect',
            material: 'Material',
            height: 'Height',
            location: 'Location'
        }
    },
    profile: {
        header: 'ARCH·TRACE // SECURITY CLEARANCE',
        memberSince: 'MEMBER SINCE',
        statusActive: 'ACTIVE',
        attributeAnalysis: 'ATTRIBUTE ANALYSIS',
        savedBlueprints: 'SAVED BLUEPRINTS',
        noFavorites: 'No blueprints secured.',
        visitArchive: 'Visit Archive',
        honors: 'HONORS',
        awaitingMerits: 'Awaiting Merits...',
        systemOps: 'SYSTEM OPS',
        editProfile: 'EDIT PROFILE',
        changePassword: 'CHANGE PASSWORD',
        logout: 'LOGOUT',
        stats: {
            str: 'STR',
            his: 'HIS',
            obs: 'OBS',
            mat: 'MAT',
            aes: 'AES'
        }
    },
    tags: {
        "新文艺复兴式": "Neo-Renaissance",
        "现代主义": "Modernism",
        "帝冠样式": "Imperial Crown Style",
        "和洋折衷": "Fusion of Japanese & Western",
        "交通建筑": "Transportation",
        "酒店建筑": "Hotel",
        "办公建筑": "Office",
        "文化建筑": "Cultural",
        "居住建筑": "Residential",
        "红砖建筑": "Red Brick",
        "明治时代": "Meiji Era",
        "大正时代": "Taisho Era",
        "昭和时代": "Showa Era",
        "车站": "Station",
        "现存": "Extant",
        "部分保留": "Partially Preserved",
        "重建": "Reconstructed",
        "已拆除": "Demolished",
        "移筑": "Relocated",
        "红砖": "Red Brick",
        "钢结构": "Steel Structure",
        "混凝土": "Concrete",
        "石材": "Stone",
        "清水混凝土": "Exposed Concrete",
        "钢筋混凝土": "Reinforced Concrete",
        "玻璃": "Glass",
        "玻璃幕墙": "Glass Curtain Wall",
        "木材": "Wood",
        "竹材": "Bamboo",
        "纸": "Paper",
        "金箔": "Gold Leaf",
        "气膜": "Air Dome",
        "装饰艺术": "Art Deco",
        "结构表现主义": "Structural Expressionism",
        "新和风": "Neo-Japanesque",
        "流动建筑": "Fluid Architecture",
        "代谢派": "Metabolism",
        "数寄屋造": "Sukiya-zukuri",
        "飞鸟时代": "Asuka Period",
        "寝殿造": "Shinden-zukuri",
        "和样建筑": "Wayō Style",
        "北山文化": "Kitayama Culture",
        "高技派": "High-tech",
        "极简主义": "Minimalism",
        "城郭建筑": "Castle Architecture"
    }
}
