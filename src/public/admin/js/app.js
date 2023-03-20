var app = {
    init: function () {
        this.events();
    },
    events: function () {
        $(document).on('click', '#popup', function (e) {
            e.preventDefault();
            var self = $(this), urlRequest = self.data('url') || '';

            if (urlRequest.trim().length > 0) {
                $.ajax({
                    url: urlRequest,
                    dataType: 'html',
                    success: function (data) {
                        const modalContent = $('#modal').find('.modal-content').first();
                        modalContent.html(data);
                        $('#modal').modal('show');
                    }
                });
            }
        });

        $(document).on('submit', 'form[data-ajax="true"]', function (event) {
            var form = $(this);
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                dataType: 'json',
                beforeSend: function () {
                    form.find('label.form-check-label').text('');
                }
            }).done(function (response) {
                if (!response.success) {
                    if (response.error) {
                        $.each(response.error, function (index, item) {
                            form.find(`label[for="${item.param}"]`).first().text(item.msg);
                        });
                    }
                } else {

                }
            });

            event.preventDefault();
        });
    },
    fetchData: function (options) {
        return new Promise((resolve, reject) => {
            $.ajax({
                cache: options.cache || true,
                url: options.url,
                type: options.type || 'GET',
                data: options.data || {},
                dataType: options.dataType || 'json',
                beforeSend: options.beforeSend || function(){},
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            }).always(options.always || function(){});
        });
    },
    bindTableData: function (path, destination) {
        destination = destination || 'table-result';
        app.fetchData(
            {
                url: path + location.search,
                dataType: 'html',
                type: 'post'
            })
            .then((response) => {
                $(`#${destination}`).html(response);
            })
            .catch((error) => {
                console.error(error)
            })
    },
    addParam: function (currentUrl, key, val) {
        var url = new URL(currentUrl);
        url.searchParams.set(key, val);
        return url.href; 
    },
    setQueryParameter: function (uri, key, value) {
        var re = new RegExp("([?&])(" + key + "=)[^&#]*", "g");
        if (uri.match(re))
            return uri.replace(re, '$1$2' + value);

        // need to add parameter to URI
        var paramString = (uri.indexOf('?') < 0 ? "?" : "&") + key + "=" + value;
        var hashIndex = uri.indexOf('#');
        if (hashIndex < 0)
            return uri + paramString;
        else
            return uri.substring(0, hashIndex) + paramString + uri.substring(hashIndex);
    },
    pushState: function (object) {
        if (window.history && window.history.pushState) {
            var url = new URL(window.location.href);
            for (var key in object) {
                url.searchParams.set(key, object[key]);
            }
            window.history.pushState(null, '', url);
        }
    },
}

$(function () {
    app.init();
});