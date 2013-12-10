from django.contrib.auth.decorators import login_required
from splunkdj.decorators.render import render_to

@render_to('aqichina:home.html')
@login_required
def home(request):
    return {
        "message": "Hello World from aqichina!",
        "app_name": "aqichina"
    }