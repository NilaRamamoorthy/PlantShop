from plants.models import Category, Plant, Banner

# Ensure categories exist
category_names = ["Indoor", "Outdoor", "Succulent", "Flowering"]
for name in category_names:
    Category.objects.get_or_create(name=name)

plants_data = [
    {
        "name": "Monstera",
        "category": "Indoor",
        "price": 899,
        "stock": 20,
        "size": "Medium",
        "height": "40cm",
        "humidity": "High",
        "light_requirement": "Indirect Sunlight",
        "water_requirement": "Weekly",
        "pet_friendly": False,
        "description": "Monstera is a popular indoor tropical plant known for its beautiful split leaves. It thrives in bright indirect sunlight.",
    },
    {
        "name": "Snake Plant",
        "category": "Indoor",
        "price": 499,
        "stock": 30,
        "size": "Small",
        "height": "35cm",
        "humidity": "Low",
        "light_requirement": "Low Light",
        "water_requirement": "Biweekly",
        "pet_friendly": False,
        "description": "Snake plant is one of the easiest indoor plants to maintain. It improves indoor air quality and requires minimal watering.",
    },
    {
        "name": "Peace Lily",
        "category": "Indoor",
        "price": 699,
        "stock": 15,
        "size": "Medium",
        "height": "45cm",
        "humidity": "High",
        "light_requirement": "Shade",
        "water_requirement": "Weekly",
        "pet_friendly": False,
        "description": "Peace lily produces elegant white flowers and glossy green leaves. Perfect for indoor decor.",
    },
    {
        "name": "Aloe Vera",
        "category": "Succulent",
        "price": 399,
        "stock": 25,
        "size": "Small",
        "height": "30cm",
        "humidity": "Low",
        "light_requirement": "Bright Light",
        "water_requirement": "Biweekly",
        "pet_friendly": True,
        "description": "Aloe vera is a medicinal plant known for its healing gel. It thrives in sunny indoor locations.",
    },
    {
        "name": "Rubber Plant",
        "category": "Indoor",
        "price": 999,
        "stock": 12,
        "size": "Large",
        "height": "60cm",
        "humidity": "Medium",
        "light_requirement": "Bright Indirect Light",
        "water_requirement": "Weekly",
        "pet_friendly": False,
        "description": "Rubber plant is a stylish indoor plant with thick glossy leaves. It adds a bold green look to homes.",
    },
    {
        "name": "Fiddle Leaf Fig",
        "category": "Indoor",
        "price": 1499,
        "stock": 10,
        "size": "Large",
        "height": "80cm",
        "humidity": "Medium",
        "light_requirement": "Bright Light",
        "water_requirement": "Weekly",
        "pet_friendly": False,
        "description": "Fiddle leaf fig is a trendy indoor plant known for its large violin-shaped leaves.",
    },
    {
        "name": "Jade Plant",
        "category": "Succulent",
        "price": 350,
        "stock": 35,
        "size": "Small",
        "height": "25cm",
        "humidity": "Low",
        "light_requirement": "Bright Light",
        "water_requirement": "Every 10 days",
        "pet_friendly": True,
        "description": "Jade plant is a symbol of prosperity and good luck. It is extremely easy to maintain.",
    },
    {
        "name": "Hibiscus",
        "category": "Flowering",
        "price": 550,
        "stock": 18,
        "size": "Medium",
        "height": "50cm",
        "humidity": "Medium",
        "light_requirement": "Full Sun",
        "water_requirement": "2-3 times per week",
        "pet_friendly": True,
        "description": "Hibiscus produces large colorful flowers and thrives outdoors in sunny areas.",
    },
    {
        "name": "Bougainvillea",
        "category": "Flowering",
        "price": 650,
        "stock": 14,
        "size": "Medium",
        "height": "55cm",
        "humidity": "Medium",
        "light_requirement": "Full Sun",
        "water_requirement": "Weekly",
        "pet_friendly": True,
        "description": "Bougainvillea is a vibrant flowering plant ideal for gardens and balconies.",
    },
    {
        "name": "Money Plant",
        "category": "Indoor",
        "price": 299,
        "stock": 40,
        "size": "Small",
        "height": "20cm",
        "humidity": "Medium",
        "light_requirement": "Indirect Light",
        "water_requirement": "Weekly",
        "pet_friendly": True,
        "description": "Money plant is believed to bring prosperity and is widely used in home decor.",
    },
]

for item in plants_data:
    category = Category.objects.get(name=item["category"])

    obj, created = Plant.objects.update_or_create(
        name=item["name"],
        defaults={
            "category": category,
            "price": item["price"],
            "stock": item["stock"],
            "size": item["size"],
            "height": item["height"],
            "humidity": item["humidity"],
            "light_requirement": item["light_requirement"],
            "water_requirement": item["water_requirement"],
            "pet_friendly": item["pet_friendly"],
            "description": item["description"],
            "short_description": item["description"][:80],
            "is_active": True,
        },
    )
    print(f"{'Created' if created else 'Updated'}: {obj.name}")

Banner.objects.get_or_create(
    title="30% Off",
    defaults={
        "subtitle": "Till 30 Dec",
        "is_active": True,
        "sort_order": 1,
    },
)

print("Final plant count:", Plant.objects.count())
print("Final banner count:", Banner.objects.count())