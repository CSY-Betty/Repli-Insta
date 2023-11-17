from rest_framework import serializers
from .models import Profile
from posts.models import Post
from posts.serializers import PostSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "first_name", "last_name", "bio", "avatar", "friends"]


class ProfilePostSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "user",
            "first_name",
            "last_name",
            "bio",
            "avatar",
            "friends",
            "posts",
            "slug",
        ]
