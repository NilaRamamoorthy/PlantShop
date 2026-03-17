from django.urls import path
from .views import CheckoutPreviewView, OrderCreateView, OrderListView, OrderDetailView

urlpatterns = [
    path("checkout/preview/", CheckoutPreviewView.as_view(), name="checkout-preview"),
    path("", OrderCreateView.as_view(), name="order-create"),
    path("list/", OrderListView.as_view(), name="order-list"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]