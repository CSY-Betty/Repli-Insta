from .models import Profile


def profile_pic(request):
    if request.user.is_authenticated:
        profile_obj = Profile.objects.get(user=request.user)
        user_avatar = profile_obj.avatar
        user_slug = profile_obj.slug
        user_id = request.user.id
        return {"user_avatar": user_avatar, "user_slug": user_slug, "user_id": user_id}
    return {}
