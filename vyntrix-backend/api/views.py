import json

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def register(request):
    if request.method != "POST":
        response = JsonResponse({"detail": "Method not allowed."}, status=405)
        response["Allow"] = "POST"
        return response

    try:
        data = json.loads(request.body or "{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "Request body must be valid JSON."}, status=400)

    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")
    User = get_user_model()

    errors = {}
    if not username:
        errors["username"] = "Username is required."
    elif User.objects.filter(username__iexact=username).exists():
        errors["username"] = "That username is already taken."
    if not email:
        errors["email"] = "Email is required."
    else:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "Enter a valid email address."
        if User.objects.filter(email__iexact=email).exists():
            errors["email"] = "An account with this email already exists."
    if not isinstance(password, str) or len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."

    if errors:
        return JsonResponse({"errors": errors}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse(
        {"message": "Your account has been created.", "user": {"id": user.pk, "username": user.username, "email": user.email}},
        status=201,
    )
