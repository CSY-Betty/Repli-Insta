from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["content", "image", "liked", "updated", "created", "author"]


class CommentSerializer(serializers.ModelSerializer):
    commenter_profile = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["user", "post", "body", "updated", "created", "commenter_profile"]

    def get_commenter_profile(self, comment):
        from profiles.serializers import ProfileSerializer

        profile_serializer = ProfileSerializer(comment.user)
        return profile_serializer.data


class PostProfileSerializer(serializers.ModelSerializer):
    post_id = serializers.ReadOnlyField(source="id")
    author_profile = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "post_id",
            "content",
            "image",
            "liked",
            "updated",
            "created",
            "author",
            "author_profile",
        ]

    def get_author_profile(self, post):
        from profiles.serializers import ProfileSerializer

        profile_serializer = ProfileSerializer(post.author)
        return profile_serializer.data


class LikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["user", "post", "value"]
