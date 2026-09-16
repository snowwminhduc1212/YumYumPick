/**
 * Mock Data Ngày 1 phục vụ phát triển Swipe Deck & Detail Recipe View.
 * Đã cập nhật ĐẦY ĐỦ cấu trúc theo chuẩn Backend mới nhất (dishes_seed.json).
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
    "id": "dish_kr_001",
    "name": "Cơm Trộn Bibimbap",
    "english_name": "Korean Mixed Rice",
    "cuisine": "Korea",
    "region": "Toàn quốc",
    "image": "/images/dishes/dish_kr_001.jpg",
    "cook_time_minutes": 25,
    "prep_time_minutes": 15,
    "difficulty": "Dễ",
    "spicy_level": 1,
    "calories_approx": 560,
    "short_description": "Bữa tiệc sắc màu với cơm trắng dẻo, rau củ xào giòn, thịt bò mềm và sốt ớt Gochujang cay ngọt đậm vị.",
    "tips": "Dùng chảo đá nóng để tạo lớp cơm cháy giòn rụm bên dưới đáy thố.",
    "ingredients": [
      {
        "name": "Cơm trắng",
        "amount": "2",
        "unit": "chén",
        "category": "tinh bột"
      },
      {
        "name": "Thịt bò thái mỏng",
        "amount": "150",
        "unit": "g",
        "category": "thịt"
      },
      {
        "name": "Rau củ (cà rốt, nấm, cải bó xôi, giá)",
        "amount": "200",
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
        "name": "Tương ớt Gochujang",
        "amount": "2",
        "unit": "muỗng",
        "category": "gia vị"
      }
    ],
    "steps": [
      {
        "step_number": 1,
        "title": "Sơ chế rau củ",
        "description": "Thái chỉ các loại rau củ. Chần sơ cải bó xôi và giá đỗ, sau đó xào chín tới cà rốt và nấm với chút dầu mè."
      },
      {
        "step_number": 2,
        "title": "Xào thịt bò & Ốp la",
        "description": "Ướp thịt bò với nước tương và đường rồi xào chín nhanh. Chiên một quả trứng ốp la lòng đào."
      },
      {
        "step_number": 3,
        "title": "Trình bày",
        "description": "Xới cơm ra thố đá nóng, xếp gọn gàng các loại rau củ và thịt bò xung quanh, đặt trứng ốp la ở giữa và rưới sốt Gochujang lên trên."
      }
    ],
    "image_url": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80"
  }
];
