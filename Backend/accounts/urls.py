from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    WishlistListCreateView,
    WishlistDeleteView,
    WishlistToggleView,
    AddressListCreateView,
    AddressDetailView,
    PaymentMethodListCreateView,
    PaymentMethodDetailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),

    path("wishlist/", WishlistListCreateView.as_view(), name="wishlist-list-create"),
    path("wishlist/<int:plant_id>/", WishlistDeleteView.as_view(), name="wishlist-delete"),
    path("wishlist/toggle/", WishlistToggleView.as_view(), name="wishlist-toggle"),

    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),

    path("payment-methods/", PaymentMethodListCreateView.as_view(), name="payment-method-list-create"),
    path("payment-methods/<int:pk>/", PaymentMethodDetailView.as_view(), name="payment-method-detail"),
]