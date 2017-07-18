from django.shortcuts import render_to_response, HttpResponse, redirect, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from cartoview.app_manager.models import AppInstance, App
from . import APP_NAME
import json
from django.conf import settings
from cartoview_map_viewer import views as viewer_views
from .viewer_widgets import widgets
from django.contrib.auth.decorators import login_required


def view_map(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.view_app(request, instance_id, template="%s/view.html" % APP_NAME, context=context)


def map_config(request):
    instance_id = request.GET.get("id")
    instance = AppInstance.objects.get(pk=instance_id)
    config = instance.map.viewer_json(request.user)
    return HttpResponse(json.dumps(config), content_type="application/json")

def save(request, instance_id=None, app_name=APP_NAME):
    res_json = dict(success=False)
    # try:
    map_id = request.POST.get('map', None)
    title = request.POST.get('title', "")
    config = request.POST.get('config', None)
    abstract = request.POST.get('abstract', "")
    if instance_id is None:
        instance_obj = AppInstance()
        instance_obj.app = App.objects.get(name=app_name)
        instance_obj.owner = request.user
    else:
        instance_obj = AppInstance.objects.get(pk=instance_id)
    instance_obj.title = title
    instance_obj.config = config
    instance_obj.abstract = abstract
    instance_obj.map_id = map_id
    instance_obj.save()
    res_json.update(dict(success=True, id=instance_obj.id))
    # except Exception, e:
    #     print e
    #     res_json["error_message"] = str(e)
    return HttpResponse(json.dumps(res_json), content_type="application/json")
@login_required
def new(request, template="%s/edit.html" % APP_NAME, app_name=APP_NAME, context={}):
    context = dict(widgets=widgets)
    if request.method == 'POST':
        return save(request, app_name=app_name)
    return render(request, template, context)

@login_required
def edit(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.edit(request, instance_id, context=context)
