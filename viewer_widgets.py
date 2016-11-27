from django.templatetags.static import static
from . import APP_NAME

widgets = [{
    'title': 'Time Data Viewer',
    'name': 'TimeDataViewer',

    'config': {
        'directive': 'time-data-viewer-config',
        'js': [
            static("%s/js/config/time-data-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/config.css" % APP_NAME),
        ]
    },
    'view': {
        'directive': 'time-data-viewer',
        'js': [
            static("%s/js/view/app.js" % APP_NAME),
            static("%s/js/view/main-controller.js" % APP_NAME),
            static("%s/js/view/time-data-viewer-service.js" % APP_NAME),
            static("%s/js/view/time-data-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/view.css" % APP_NAME),
        ]
    },
}]