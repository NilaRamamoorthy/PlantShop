from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["plant_name", "unit_price", "quantity", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "order_number", "user", "status", "payment_status", "total_amount", "created_at"]
    list_filter = ["status", "payment_status"]
    search_fields = ["order_number", "user__email"]
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "plant_name", "quantity", "line_total"]