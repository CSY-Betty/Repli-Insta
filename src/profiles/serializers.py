from rest_framework import serializers
from .models import Profile, Relationship
from posts.serializers import PostSerializer


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "first_name", "last_name", "bio", "avatar", "friends", "slug"]


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


class RelationshipSerializer(serializers.ModelSerializer):
    counterpart_profile = serializers.SerializerMethodField()

    class Meta:
        model = Relationship
        fields = ["sender", "receiver", "status", "counterpart_profile"]

    def get_counterpart_profile(self, obj):
        user = self.context["request"].user.profile
        counterpart = obj.receiver if obj.sender == user else obj.sender

        serialized_profile = ProfileSerializer(counterpart).data
        return serialized_profile
