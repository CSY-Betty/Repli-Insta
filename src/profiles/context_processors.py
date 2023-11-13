from .models import Profile


def profile_pic(request):
    if request.user.is_authenticated:
        profile_obj = Profile.objects.get(user=request.user)
        user_avatar = profile_obj.avatar
        return {"user_avatar": user_avatar}
    return {}
