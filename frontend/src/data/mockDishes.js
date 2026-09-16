/**
 * Mock Data for Frontend development with full dish details (ingredients, steps, tips).
 * Extracted from backend/app/data/dishes_seed.json
 */
export const MOCK_DISHES = [
  {
    "id": "dish_vn_001",
    "name": "Phở Bò Tái Nạm",
    "english_name": "Traditional Beef Pho",
    "cuisine": "Vietnam",
    "region": "Miền Bắc",
    "image": "/images/dishes/dish_vn_001.jpg",
    "cook_time_minutes": 45,
    "prep_time_minutes": 15,
    "difficulty": "Trung bình",
    "spicy_level": 0,
    "calories_approx": 480,
    "short_description": "Món quốc hồn quốc túy với nước dùng thanh ngọt hầm từ xương bò, thơm mùi hồi quế đặc trưng.",
    "tips": "Nướng gừng và hành tím trước khi thả vào nồi nước dùng sẽ giúp nước trong và thơm dậy mùi gấp đôi.",
    "ingredients": [
      {
        "name": "Bánh phở tươi",
        "amount": "500",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Thịt bò nạm và thăn",
        "amount": "300",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Xương ống bò",
        "amount": "1",
        "unit": "kg",
        "category": "thịt"
      },
      {
        "name": "Gừng và hành tím nướng",
        "amount": "3",
        "unit": "củ",
        "category": "gia vị"
      },
      {
        "name": "Hoa hồi, quế, thảo quả",
        "amount": "1",
        "unit": "gói",
        "category": "gia vị"
      },
      {
        "name": "Hành lá, ngò gai, chanh, ớt",
        "amount": "1",
        "unit": "ít",
        "category": "rau thơm"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Sơ chế & Trụng xương",
        "description": "Rửa sạch xương bò với nước muối, đun sôi 5 phút để khử bọt bẩn rồi rửa lại bằng nước lạnh."
      },
      {
        "step_number": 2,
        "title": "Hầm nước dùng",
        "description": "Ninh xương bò cùng gừng hành tím nướng và gói thảo quả quế hồi trên lửa nhỏ liu riu trong 40 phút, hớt bọt thường xuyên."
      },
      {
        "step_number": 3,
        "title": "Hoàn thiện & Thưởng thức",
        "description": "Trụng bánh phở vào tô, xếp thịt bò thái mỏng lên trên, chan nước dùng thật sôi vào để thịt chín tái, rắc hành lá và ớt tươi."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_002",
    "name": "Cơm Tấm Sườn Bì Chả",
    "english_name": "Broken Rice with Grilled Pork Chops",
    "cuisine": "Vietnam",
    "region": "Miền Nam",
    "image": "/images/dishes/dish_vn_002.jpg",
    "cook_time_minutes": 35,
    "prep_time_minutes": 20,
    "difficulty": "Trung bình",
    "spicy_level": 0,
    "calories_approx": 650,
    "short_description": "Đặc sản nức tiếng Sài Gòn với miếng sườn cốt lết nướng mật ong thơm lừng, bì dai giòn và chả trứng hấp béo ngậy.",
    "tips": "Ướp sườn với sữa đặc hoặc nước cam sẽ giúp thớ thịt sườn mềm tan và không bị khô khi nướng.",
    "ingredients": [
      {
        "name": "Gạo tấm",
        "amount": "300",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Sườn cốt lết heo",
        "amount": "400",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Bì heo trộn thính",
        "amount": "100",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Thịt xay & mộc nhĩ làm chả",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Trứng vịt",
        "amount": "2",
        "unit": "quả",
        "category": "trứng"
      },
      {
        "name": "Mỡ hành & Đồ chua",
        "amount": "1",
        "unit": "chén",
        "category": "rau củ"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Ướp sườn & Nướng",
        "description": "Dần mềm miếng sườn, ướp với tỏi, sả băm, mật ong, nước mắm trong 20 phút rồi nướng vàng xém hai mặt."
      },
      {
        "step_number": 2,
        "title": "Hấp chả trứng",
        "description": "Trộn thịt xay, mộc nhĩ, trứng rồi đem hấp cách thủy 20 phút, phết lòng đỏ trứng lên mặt cho vàng óng."
      },
      {
        "step_number": 3,
        "title": "Trình bày",
        "description": "Xới cơm tấm nóng ra đĩa, đặt sườn nướng, chả trứng, bì heo lên trên, chan mỡ hành béo ngậy và ăn kèm nước mắm tỏi ớt kẹo."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_003",
    "name": "Bún Chả Hà Nội",
    "english_name": "Hanoi Grilled Pork with Vermicelli",
    "cuisine": "Vietnam",
    "region": "Miền Bắc",
    "image": "/images/dishes/dish_vn_003.jpg",
    "cook_time_minutes": 30,
    "prep_time_minutes": 20,
    "difficulty": "Trung bình",
    "spicy_level": 1,
    "calories_approx": 520,
    "short_description": "Chả miếng và chả viên nướng than hoa thơm nức mũi, thả vào bát nước mắm chua ngọt ấm nồng cùng đu đủ giòn sần sật.",
    "tips": "Dùng nước hàng (kẹo đắng) tự thắng bằng đường phèn để ướp chả sẽ cho màu cánh gián tuyệt đẹp.",
    "ingredients": [
      {
        "name": "Bún tươi sợi nhỏ",
        "amount": "400",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Thịt ba chỉ heo",
        "amount": "250",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Thịt nạc vai xay",
        "amount": "250",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Đu đủ xanh, cà rốt",
        "amount": "1",
        "unit": "củ",
        "category": "rau củ"
      },
      {
        "name": "Rau sống, kinh giới, tía tô",
        "amount": "200",
        "unit": "g",
        "category": "rau thơm"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Ướp & Viên chả",
        "description": "Ướp thịt ba chỉ thái mỏng và thịt xay với nước mắm, hành khô, hạt tiêu. Viên thịt xay thành từng viên tròn dẹt."
      },
      {
        "step_number": 2,
        "title": "Nướng chả",
        "description": "Kẹp chả vào vỉ nướng trên than hoa hoặc nồi chiên không dầu ở 180°C đến khi vàng thơm xém cạnh."
      },
      {
        "step_number": 3,
        "title": "Pha nước chấm",
        "description": "Pha nước mắm, giấm, đường, nước ấm theo tỉ lệ 1:1:1:5, thả đu đủ muối chua, tỏi ớt băm và chả nóng vào tô."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_004",
    "name": "Bánh Mì Chảo Thập Cẩm",
    "english_name": "Vietnamese Combination Pan Bread",
    "cuisine": "Vietnam",
    "region": "Toàn quốc",
    "image": "/images/dishes/dish_vn_004.jpg",
    "cook_time_minutes": 15,
    "prep_time_minutes": 5,
    "difficulty": "Dễ",
    "spicy_level": 0,
    "calories_approx": 550,
    "short_description": "Chảo gang xèo xèo sôi sùng sục gồm pate béo ngậy, trứng ốp la lòng đào, xúc xích và nước sốt cà chua đậm đà chấm bánh mì giòn rụm.",
    "tips": "Cho một lát bơ lạt vào chảo ngay trước khi tắt bếp để nước sốt dậy mùi thơm béo ngậy.",
    "ingredients": [
      {
        "name": "Bánh mì giòn",
        "amount": "2",
        "unit": "ổ",
        "category": "tinh bột"
      },
      {
        "name": "Trứng gà",
        "amount": "2",
        "unit": "quả",
        "category": "trứng"
      },
      {
        "name": "Pate gan heo",
        "amount": "50",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Xúc xích hoặc lạp xưởng",
        "amount": "1",
        "unit": "cây",
        "category": "thịt"
      },
      {
        "name": "Sốt cà chua đậm vị",
        "amount": "100",
        "unit": "ml",
        "category": "gia vị"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Áp chảo topping",
        "description": "Làm nóng chảo gang với chút bơ, khía xúc xích rồi chiên xém cạnh, thả pate vào áp chảo cho mềm."
      },
      {
        "step_number": 2,
        "title": "Ốp la & Nấu sốt",
        "description": "Đập 2 quả trứng gà vào chảo để lòng đào, rưới nước sốt cà chua đun sôi liu riu quanh mép chảo."
      },
      {
        "step_number": 3,
        "title": "Thưởng thức",
        "description": "Rắc hạt tiêu đen, ngò rí lên trên và dùng nóng ngay với bánh mì nướng giòn tan."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_005",
    "name": "Bún Bò Huế Đậm Đà",
    "english_name": "Hue Spicy Beef Noodle Soup",
    "cuisine": "Vietnam",
    "region": "Miền Trung",
    "image": "/images/dishes/dish_vn_005.jpg",
    "cook_time_minutes": 50,
    "prep_time_minutes": 20,
    "difficulty": "Kỳ công",
    "spicy_level": 2,
    "calories_approx": 580,
    "short_description": "Nước dùng đỏ au màu ớt sate, nồng nàn hương sả và mắm ruốc Huế hòa quyện cùng bắp bò mềm ngọt và giò heo giòn béo.",
    "tips": "Khuấy mắm ruốc với nước lạnh, để lắng cặn rồi mới lấy phần nước trong châm vào nồi hầm.",
    "ingredients": [
      {
        "name": "Bún sợi to",
        "amount": "400",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Bắp bò hoa",
        "amount": "300",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Chả cua hoặc mọc heo",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Sả cây đập dập",
        "amount": "5",
        "unit": "cây",
        "category": "gia vị"
      },
      {
        "name": "Mắm ruốc Huế",
        "amount": "2",
        "unit": "muỗng canh",
        "category": "gia vị"
      },
      {
        "name": "Hoa chuối, rau muống chẻ",
        "amount": "1",
        "unit": "đĩa",
        "category": "rau sống"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Hầm bắp bò với sả",
        "description": "Luộc bắp bò cùng sả đập dập trên lửa vừa khoảng 30 phút đến khi thịt chín mềm vừa tới, vớt ra ngâm nước đá."
      },
      {
        "step_number": 2,
        "title": "Nêm nếm nước dùng",
        "description": "Chắt nước mắm ruốc đã lắng vào nồi, thêm dầu màu điều, ớt sate Huế và hạt nêm cho vừa miệng."
      },
      {
        "step_number": 3,
        "title": "Lên tô bún",
        "description": "Trụng bún sợi to, xếp bắp bò thái lát, chả cua, rưới nước dùng sôi sùng sục, ăn kèm hoa chuối bào và ớt ngâm giấm."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_006",
    "name": "Gỏi Cuốn Tôm Thịt",
    "english_name": "Vietnamese Fresh Spring Rolls",
    "cuisine": "Vietnam",
    "region": "Miền Nam",
    "image": "/images/dishes/dish_vn_006.jpg",
    "cook_time_minutes": 20,
    "prep_time_minutes": 15,
    "difficulty": "Dễ",
    "spicy_level": 0,
    "calories_approx": 320,
    "short_description": "Món cuốn thanh mát lành mạnh với tôm sú luộc đỏ au, thịt ba chỉ luộc thái mỏng, bún và rau thơm bọc trong bánh tráng mỏng chấm tương đậu phộng.",
    "tips": "Chọn bánh tráng dẻo không cần nhúng quá nhiều nước để cuốn không bị rách và dính tay.",
    "ingredients": [
      {
        "name": "Bánh tráng dẻo",
        "amount": "1",
        "unit": "gói",
        "category": "tinh bột"
      },
      {
        "name": "Tôm sú tươi luộc",
        "amount": "200",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Thịt ba chỉ luộc",
        "amount": "200",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Bún tươi",
        "amount": "200",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Rau xà lách, húng quế, hẹ lá",
        "amount": "150",
        "unit": "g",
        "category": "rau sống"
      },
      {
        "name": "Tương đen & Đậu phộng rang",
        "amount": "1",
        "unit": "chén",
        "category": "gia vị"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Sơ chế tôm thịt",
        "description": "Tôm luộc chín bóc vỏ xẻ đôi lưng. Thịt ba chỉ luộc chín với chút hành tím rồi thái lát mỏng vừa ăn."
      },
      {
        "step_number": 2,
        "title": "Cuốn gỏi",
        "description": "Trải bánh tráng, đặt xà lách, rau thơm, bún, thịt rồi cuộn 1 vòng; xếp tôm ngửa mặt đỏ và cọng hẹ thò ra ngoài rồi cuốn chặt tay."
      },
      {
        "step_number": 3,
        "title": "Pha sốt tương",
        "description": "Đun ấm tương đen với chút bơ đậu phộng, múc ra chén rắc đậu phộng rang giã nhỏ và ớt băm."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_007",
    "name": "Canh Chua Cá Lóc Nam Bộ",
    "english_name": "Mekong Sour Fish Soup",
    "cuisine": "Vietnam",
    "region": "Miền Nam",
    "image": "/images/dishes/dish_vn_007.jpg",
    "cook_time_minutes": 25,
    "prep_time_minutes": 15,
    "difficulty": "Dễ",
    "spicy_level": 1,
    "calories_approx": 350,
    "short_description": "Vị chua thanh mát từ me dốt kết hợp ngọt dịu của khóm và cà chua, miếng cá lóc đồng ngọt thịt chấm nước mắm ớt cay nồng.",
    "tips": "Phi thơm tỏi băm ngả vàng rộm rồi rắc lên mặt canh trước khi tắt bếp để khử tanh cá hoàn toàn.",
    "ingredients": [
      {
        "name": "Cá lóc đồng làm sạch",
        "amount": "400",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Me vắt nấu canh chua",
        "amount": "50",
        "unit": "g",
        "category": "gia vị"
      },
      {
        "name": "Khóm (dứa), cà chua",
        "amount": "200",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Bạc hà (dọc mùng), đậu bắp, giá",
        "amount": "200",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Ngò gai, ngò ôm (rau ngổ)",
        "amount": "1",
        "unit": "nắm",
        "category": "rau thơm"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Nấu nước me & cá",
        "description": "Dằm me lấy nước chua đun sôi cùng nước dùng. Thả khứa cá lóc vào nấu chín tới rồi vớt cá ra đĩa riêng."
      },
      {
        "step_number": 2,
        "title": "Nấu rau củ",
        "description": "Thả khóm, cà chua, đậu bắp, bạc hà vào nồi đun sôi 3 phút, nêm nước mắm và đường phèn cho chua ngọt cân đối."
      },
      {
        "step_number": 3,
        "title": "Hoàn tất",
        "description": "Cho giá và cá trở lại nồi, rắc ngò gai, ngò ôm thái nhỏ cùng tỏi phi vàng thơm lừng."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_008",
    "name": "Bánh Xèo Miền Tây Giòn Rụm",
    "english_name": "Crispy Vietnamese Sizzling Pancake",
    "cuisine": "Vietnam",
    "region": "Miền Nam",
    "image": "/images/dishes/dish_vn_008.jpg",
    "cook_time_minutes": 30,
    "prep_time_minutes": 20,
    "difficulty": "Trung bình",
    "spicy_level": 0,
    "calories_approx": 520,
    "short_description": "Vỏ bánh vàng ươm bột nghệ giòn tan viền mỏng, nhân tôm đất nhảy tanh tách, thịt ba rọi và giá đỗ cuốn rau rừng chấm mắm chua ngọt.",
    "tips": "Pha bột với một chút nước cốt dừa và bia lạnh sẽ giúp vỏ bánh giòn lâu suốt 2 tiếng mà không bị mềm ỉu.",
    "ingredients": [
      {
        "name": "Bột bánh xèo pha sẵn",
        "amount": "250",
        "unit": "g",
        "category": "tinh bột"
      },
      {
        "name": "Nước cốt dừa & bia",
        "amount": "200",
        "unit": "ml",
        "category": "khác"
      },
      {
        "name": "Tôm đất nhỏ",
        "amount": "200",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Thịt ba rọi thái mỏng",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Giá đỗ và đậu xanh luộc",
        "amount": "150",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Rau cải xanh, đọt cóc, xà lách",
        "amount": "1",
        "unit": "rổ",
        "category": "rau sống"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Pha bột & Xào nhân",
        "description": "Hòa bột bánh xèo với nước cốt dừa, bia, hành lá thái nhỏ. Xào săn tôm và thịt ba rọi nêm chút hạt nêm."
      },
      {
        "step_number": 2,
        "title": "Đổ bánh xèo",
        "description": "Láng dầu vào chảo lớn thật nóng, múc 1 vá bột tráng đều quanh chảo kêu 'xèo'. Rải tôm thịt, giá đỗ đậy nắp 2 phút."
      },
      {
        "step_number": 3,
        "title": "Gấp bánh",
        "description": "Mở nắp, rưới thêm chút dầu quanh vành bánh đến khi mép bánh giòn rụm bong ra thì gấp đôi lại và gắp ra đĩa."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_009",
    "name": "Bò Kho Bánh Mì",
    "english_name": "Vietnamese Braised Beef Stew",
    "cuisine": "Vietnam",
    "region": "Toàn quốc",
    "image": "/images/dishes/dish_vn_009.jpg",
    "cook_time_minutes": 45,
    "prep_time_minutes": 15,
    "difficulty": "Trung bình",
    "spicy_level": 1,
    "calories_approx": 590,
    "short_description": "Thịt nạm gầu bò ninh mềm rục thấm đẫm sốt hạt điều đỏ cam, thơm lừng hoa hồi sả cây ăn cùng bánh mì nóng hổi.",
    "tips": "Dùng nước dừa tươi để kho thịt sẽ giúp thớ bò ngọt sâu tự nhiên mà không cần nêm quá nhiều đường bột ngọt.",
    "ingredients": [
      {
        "name": "Nạm bò kèm gân",
        "amount": "500",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Nước dừa tươi",
        "amount": "500",
        "unit": "ml",
        "category": "nước dùng"
      },
      {
        "name": "Cà rốt cắt khúc tỉa hoa",
        "amount": "2",
        "unit": "củ",
        "category": "rau củ"
      },
      {
        "name": "Gói gia vị bò kho & sả cây",
        "amount": "1",
        "unit": "gói",
        "category": "gia vị"
      },
      {
        "name": "Bánh mì ăn kèm",
        "amount": "2",
        "unit": "ổ",
        "category": "tinh bột"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Ướp thịt bò",
        "description": "Thái thịt bò quân cờ, ướp với gia vị bò kho, sả băm, tỏi ớt băm, dầu màu điều trong 20 phút."
      },
      {
        "step_number": 2,
        "title": "Xào săn & Ninh thịt",
        "description": "Xào thịt bò trên lửa lớn cho thật săn, đổ nước dừa tươi và sả đập dập vào hầm nhỏ lửa 35 phút cho mềm."
      },
      {
        "step_number": 3,
        "title": "Thêm cà rốt",
        "description": "Cho cà rốt vào hầm thêm 10 phút, khuấy chút bột năng cho nước sốt sánh sệt rồi múc ra tô rắc húng quế."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_vn_010",
    "name": "Chả Giò Tôm Thịt Giòn Tan",
    "english_name": "Crispy Vietnamese Spring Rolls",
    "cuisine": "Vietnam",
    "region": "Toàn quốc",
    "image": "/images/dishes/dish_vn_010.jpg",
    "cook_time_minutes": 25,
    "prep_time_minutes": 20,
    "difficulty": "Dễ",
    "spicy_level": 0,
    "calories_approx": 450,
    "short_description": "Từng cuốn chả giò chiên vàng ươm, vỏ ngoài giòn rôm rốp vỡ tan, nhân tôm thịt khoai môn bùi bùi đậm vị.",
    "tips": "Pha một muỗng giấm vào dầu ăn trước khi chiên sẽ giúp cuốn chả giò vàng đều và không bị hút ngấy dầu.",
    "ingredients": [
      {
        "name": "Bánh tráng rế hoặc bò bía",
        "amount": "1",
        "unit": "gói",
        "category": "tinh bột"
      },
      {
        "name": "Thịt heo nạc dăm xay",
        "amount": "250",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Tôm tươi băm nhỏ",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Khoai môn, cà rốt thái sợi",
        "amount": "100",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Mộc nhĩ, miến dong ngâm mềm",
        "amount": "50",
        "unit": "g",
        "category": "rau củ"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Trộn nhân",
        "description": "Trộn đều thịt xay, tôm, khoai môn, mộc nhĩ, miến cắt nhỏ cùng 1 quả trứng, nêm tiêu và hạt nêm."
      },
      {
        "step_number": 2,
        "title": "Cuốn chả giò",
        "description": "Múc nhân lên bánh tráng, gấp hai mép lại và cuộn đều tay thành từng chiếc chả giò thon dài."
      },
      {
        "step_number": 3,
        "title": "Chiên 2 lửa",
        "description": "Chiên lửa 1 cho chín nhân, trước khi ăn chiên nhanh lửa 2 trên chảo ngập dầu nóng già để vỏ giòn tan khó cưỡng."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_kr_001",
    "name": "Cơm Trộn Bibimbap",
    "english_name": "Korean Mixed Rice",
    "cuisine": "Korea",
    "region": "Seoul",
    "image": "/images/dishes/dish_kr_001.jpg",
    "cook_time_minutes": 25,
    "prep_time_minutes": 15,
    "difficulty": "Dễ",
    "spicy_level": 1,
    "calories_approx": 520,
    "short_description": "Tô cơm trộn rực rỡ sắc màu ngũ hành với thịt bò xào, rau củ xào mè thơm phức và sốt Gochujang cay dịu.",
    "tips": "Nếu dùng thố đá, quét một lớp dầu mè dưới đáy thố trước khi cho cơm vào để tạo lớp cháy giòn rụm khó cưỡng.",
    "ingredients": [
      {
        "name": "Cơm trắng nấu dẻo",
        "amount": "2",
        "unit": "chén",
        "category": "tinh bột"
      },
      {
        "name": "Thịt bò thái lát mỏng",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Cà rốt, bí ngòi, giá đỗ",
        "amount": "100",
        "unit": "g mỗi loại",
        "category": "rau củ"
      },
      {
        "name": "Nấm đông cô tươi",
        "amount": "50",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Trứng gà",
        "amount": "1",
        "unit": "quả",
        "category": "trứng"
      },
      {
        "name": "Tương ớt Hàn Quốc Gochujang",
        "amount": "2",
        "unit": "muỗng canh",
        "category": "gia vị"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Sơ chế rau củ",
        "description": "Thái sợi cà rốt, bí ngòi và nấm. Luộc sơ giá đỗ rồi vắt ráo nước."
      },
      {
        "step_number": 2,
        "title": "Xào nguyên liệu",
        "description": "Xào riêng từng loại rau củ với một chút dầu mè và tỏi phi. Xào chín tới thịt bò ướp nước tương."
      },
      {
        "step_number": 3,
        "title": "Trình bày",
        "description": "Xới cơm ra tô, xếp rau củ và thịt bò theo vòng tròn, đặt trứng ốp la lòng đào vào giữa kèm muỗng sốt Gochujang."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "dish_kr_002",
    "name": "Canh Kim Chi Thịt Ba Chỉ",
    "english_name": "Kimchi Jjigae with Pork Belly",
    "cuisine": "Korea",
    "region": "Busan",
    "image": "/images/dishes/dish_kr_002.jpg",
    "cook_time_minutes": 20,
    "prep_time_minutes": 10,
    "difficulty": "Dễ",
    "spicy_level": 2,
    "calories_approx": 420,
    "short_description": "Nồi canh kim chi cay nồng nghi ngút khói với thịt ba chỉ béo ngọt, đậu hũ non mềm tan xua tan cái lạnh.",
    "tips": "Dùng kim chi cải thảo muối đã chua lâu ngày (chín kĩ) sẽ cho nước canh đậm đà và chuẩn vị nhất.",
    "ingredients": [
      {
        "name": "Kim chi cải thảo chua kèm nước",
        "amount": "250",
        "unit": "g",
        "category": "rau củ"
      },
      {
        "name": "Thịt ba chỉ heo",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Đậu hũ non",
        "amount": "1",
        "unit": "hộp",
        "category": "khác"
      },
      {
        "name": "Hành boa-rô & ớt xanh",
        "amount": "1",
        "unit": "cây",
        "category": "rau thơm"
      },
      {
        "name": "Ớt bột Hàn Quốc Gochugaru",
        "amount": "1",
        "unit": "muỗng canh",
        "category": "gia vị"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Xào thịt & kim chi",
        "description": "Thái thịt ba chỉ miếng vừa ăn, đảo trên nồi cho tươm mỡ, thêm kim chi xào cùng dầu mè 3 phút."
      },
      {
        "step_number": 2,
        "title": "Nấu canh sôi",
        "description": "Đổ nước dùng (hoặc nước vo gạo) ngập mặt, đun sôi rồi nêm ớt bột và chút tỏi băm."
      },
      {
        "step_number": 3,
        "title": "Thêm đậu hũ",
        "description": "Cắt đậu hũ non thành khối vuông thả vào nồi đun sôi thêm 5 phút, rắc hành boa-rô thái vát rồi tắt bếp."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
  }
];
