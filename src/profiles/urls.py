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
    profileSet,
    ProfileUpdateView,
    RelationshipListView,
    friend_list,
)

app_name = "profiles"

urlpatterns = [
    path("", profiles, name="profiles"),
    path("all-profiles/", ProfileListView.as_view(), name="all-profiles-view"),
    path("profile/", ProfilePostView.as_view(), name="profile"),
    path("profile/set/", profileSet, name="profile-set"),
    path("profile/set/update/", ProfileUpdateView.as_view(), name="profile-update"),
    path("<slug>/", profile, name="profile-view"),
    path("profile/friends/", friend_list, name="friends"),
    path("profile/friends/list", RelationshipListView.as_view(), name="friends-list"),
    # old
    path("profileupdate/", profile_update, name="profileupdate"),
    path("my-invites/", invites_received_view, name="my-invites-view"),
    path("to-invite/", invite_profile_list_view, name="invite-profiles-view"),
    path("send-invite/", send_invations, name="send-invite"),
    path("remove-friend/", remove_from_friends, name="remove-friend"),
    path("my-invites/accept/", accept_invitation, name="accept-invite"),
    path("my-invites/reject/", reject_invitation, name="reject-invite"),
    # path("myprofile/", my_profile, name="my-profile"),
    # path("<slug>/", ProfileDetailView.as_view(), name="profile-detail-view"),
]
