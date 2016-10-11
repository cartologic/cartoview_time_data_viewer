from django.templatetags.static import static

widgets = [{
    'title': 'Time Data Viewer',
    'name': 'TimeDataViewer',

    'config': {
        'directive': 'time-data-viewer-config',
        'js': [
            static("time_data_viewer/js/config/time-data-viewer-directive.js"),
        ],
        "css": [
            static("time_data_viewer/css/config.css"),
        ]
    },
    'view': {
        'directive': 'time-data-viewer',
        'js': [
            static("time_data_viewer/js/view/app.js"),
            static("time_data_viewer/js/view/main-controller.js"),
            static("time_data_viewer/js/view/time-data-viewer-service.js"),
            static("time_data_viewer/js/view/time-data-viewer-directive.js"),
        ],
        "css": [
            static("time_data_viewer/css/view.css"),
        ]
    },
}]