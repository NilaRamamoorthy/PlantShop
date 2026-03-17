from django.contrib import admin
from .models import Category, Plant, PlantImage, Banner


class PlantImageInline(admin.TabularInline):
    model = PlantImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "slug", "is_active", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "category", "price", "stock", "is_featured", "is_active"]
    list_filter = ["category", "is_featured", "is_active"]
    search_fields = ["name", "sku"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PlantImageInline]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "is_active", "sort_order"]