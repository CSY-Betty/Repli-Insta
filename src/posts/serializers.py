from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["content", "image", "liked", "updated", "created", "author", "id"]


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
    liked = serializers.SerializerMethodField()

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

    def get_liked(self, post):
        from profiles.serializers import ProfileSerializer

        liked_profiles = post.liked.all()
        liked_serializer = ProfileSerializer(liked_profiles, many=True)
        return liked_serializer.data


class LikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["user", "post", "value"]


class UpdatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["content", "image"]

    def update(self, instance, validated_data):
        instance.content = validated_data.get("content", instance.content)
        instance.image = validated_data.get("image", instance.image)
        instance.save()
        return instance


class DeletePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = []  # 空字段列表，因為我們只需要 ID 來刪除 Post

    def destroy(self, instance):
        instance.delete()
