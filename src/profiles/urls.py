from django.urls import path
from .views import (
    profile_update,
    my_profile,
    invites_received_view,
    invite_profile_list_view,
    ProfileListView,
    send_invations,
    remove_from_friends,
    accept_invitation,
    reject_invitation,
    ProfileDetailView,
    profiles,
    ProfilePostView,
    profile,
)

app_name = "profiles"

urlpatterns = [
    path("", profiles, name="profiles"),
    path("all-profiles/", ProfileListView.as_view(), name="all-profiles-view"),
    path("profile/", ProfilePostView.as_view(), name="profile"),
    path("<slug>/", profile, name="profile"),
    path("profileupdate/", profile_update, name="profile-update"),
    path("my-invites/", invites_received_view, name="my-invites-view"),
    path("to-invite/", invite_profile_list_view, name="invite-profiles-view"),
    path("send-invite/", send_invations, name="send-invite"),
    path("remove-friend/", remove_from_friends, name="remove-friend"),
    path("my-invites/accept/", accept_invitation, name="accept-invite"),
    path("my-invites/reject/", reject_invitation, name="reject-invite"),
    # path("myprofile/", my_profile, name="my-profile"),
    # path("<slug>/", ProfileDetailView.as_view(), name="profile-detail-view"),
]
