from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from .models import Post, Like
from profiles.models import Profile
from .forms import PostModelForm, CommentModelForm
from django.views.generic import UpdateView, DeleteView
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers import serialize
import json

# Create your views here.


# @login_required
def post_comment_create_and_list_view(request):
    all_posts = Post.objects.all()
    # profile = Profile.objects.get(user=request.user)
    profile = Profile.objects.all()

    post_form = PostModelForm()
    comment_form = CommentModelForm()
    post_added = False

    if "submmit_post" in request.POST:
        post_form = PostModelForm(request.POST, request.FILES)

        if post_form.is_valid():
            instance = post_form.save(commit=False)
            instance.author = profile
            instance.save()
            post_form = PostModelForm()
            post_added = True
        else:
            print(post_form)

    if "submmit_comment" in request.POST:
        comment_form = CommentModelForm(request.POST)
        if comment_form.is_valid():
            instance = comment_form.save(commit=False)
            instance.user = profile
            instance.post = Post.objects.get(id=request.POST.get("post_id"))
            instance.save()
            comment_form = CommentModelForm()

    context = {
        "all_posts": all_posts,
        "profile": profile,
        "post_form": post_form,
        "comment_form": comment_form,
        "post_added": post_added,
    }

    return render(request, "posts/main.html", context)


def get_post(request):
    post_id = request.GET.get("post_id")
    post = Post.objects.get(id=post_id)

    if post_id is not None:
        try:
            post = Post.objects.get(id=post_id)
            data = serialize(
                "json", [post], fields=("id", "content", "created", "image")
            )
            data_fields = json.loads(data)[0]["fields"]
            post_id = json.loads(data)[0]["pk"]

            profile = post.author
            profile_data = serialize(
                "json",
                [
                    profile,
                ],
                fields=("first_name", "last_name", "avatar"),
            )

            profile_data_fields = json.loads(profile_data)[0]["fields"]
            print(profile_data_fields)

            response_data = {
                "status": "success",
                "post": {
                    "id": post_id,
                    "content": data_fields["content"],
                    "created": data_fields["created"],
                    "image_url": data_fields["image"],
                },
                "profile": {
                    "avatar": profile_data_fields["avatar"],
                    "first_name": profile_data_fields["first_name"],
                    "last_name": profile_data_fields["last_name"],
                },
            }
        except Post.DoesNotExist:
            response_data = {"status": "error", "message": "Post not found"}
    else:
        response_data = {"status": "error", "message": "Post ID not provided"}

    return JsonResponse(response_data)


@login_required
def like_unlike_post(request):
    user = request.user
    if request.method == "POST":
        post_id = request.POST.get("post_id")
        post_obj = Post.objects.get(id=post_id)
        profile = Profile.objects.get(user=user)

        if profile in post_obj.liked.all():
            post_obj.liked.remove(profile)
        else:
            post_obj.liked.add(profile)

        like, created = Like.objects.get_or_create(user=profile, post_id=post_id)

        if not created:
            if like.value == "Like":
                like.value = "Unlike"
            else:
                like.value == "Like"
        else:
            like.value = "Like"

            post_obj.save()
            like.save()

        data = {"value": like.value, "likes": post_obj.liked.all().count()}

        return JsonResponse(data, safe=False)

    return redirect("posts:main-post-view")


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = "posts/confirm_del.html"
    success_url = reverse_lazy("posts:main-post-view")
    # success_url = "/posts/"

    def get_delete_post(self, *args, **kwargs):
        pk = self.kwargs.get("pk")
        post = Post.objects.get(pk=pk)

        if not post.author.user == self.request.user:
            messages.warning(self.request, "You need to be the author.")

        return post


class PostUpdateView(LoginRequiredMixin, UpdateView):
    form_class = PostModelForm
    model = Post
    template_name = "posts/update.html"
    success_url = reverse_lazy("posts:main-post-view")

    def form_valid(self, form):
        profile = Profile.objects.get(user=self.request.user)
        if form.instance.author == profile:
            return super().form_valid(form)
        else:
            form.add_error(None, "You need to be the author.")
            return super().form_invalid(form)
