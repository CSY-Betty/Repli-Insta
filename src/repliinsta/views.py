from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, "index.html")


def check_login_status(request):
    if request.user.is_authenticated:
        user_id = request.user.id
        return JsonResponse({"user_id": user_id})
    else:
        return JsonResponse({"user_id": 999})
