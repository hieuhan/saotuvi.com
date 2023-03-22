var app = {
    init: function () {
        this.events();
    },
    events: function () {
        $(document).on('click', '#popup', function (e) {
            e.preventDefault();
            try {
                var self = $(this), urlRequest = self.data('url') || '';

                if (urlRequest.trim().length > 0) {
                    app.fetchData({
                        url: urlRequest,
                        dataType: 'html',
                        type: 'GET'
                    }).then((response) => {
                        const modalContent = $('#modal').find('.modal-body').first();
                        modalContent.html(response);
                        $('#modal').modal('show');
                    });
                }
            } catch (error) {
                console.error(error);
            }
        });
        $(document).on('click', '.select-media', function (e) {
            e.preventDefault();
            try {
                var self = $(this), urlRequest = self.data('url') || '';

                if (urlRequest.trim().length > 0) {
                    app.fetchData({
                        url: urlRequest,
                        dataType: 'html',
                        type: 'GET'
                    }).then((response) => {
                        const modalContent = $('#media-modal').find('.modal-body').first();
                        modalContent.html(response);
                        if ($('.dropzone').length > 0) {
                            //Dropzone.autoDiscover = false;
                            $('.dropzone').dropzone({
                                paramName: 'files',
                                url: '/stv/media/upload',
                                maxFiles: 10,
                                maxFilesize: 20, // MB
                                acceptedFiles: 'image/*',    
                                addRemoveLinks: false,
                                init: function () {
                                    var dropzone = this;

                                    this.on("success", function (files, response) {
                                        console.log(files)
                                        //app.bindTableData('/admin/file/binddata', 'file-table-result');
                                        //$('.nav-tabs a[href="#tabs-home-14"]').tab('show');
                                        //dropzone.removeAllFiles();
                                        // Gets triggered when the files have successfully been sent.
                                        // Redirect user or notify of success.
                                    });
                                }
                                // success: function (file, response) {
                                //     var imgName = response;
                                //     //file.previewElement.classList.add("dz-success");
                                //     //console.log("Successfully uploaded :" + imgName);
                                // },
                                // error: function (file, response) {
                                    
                                //     //file.previewElement.classList.add("dz-error");
                                // }
                            });
                        }
                        $('#media-modal').modal('show');
                    });
                }
            } catch (error) {
                console.error(error);
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
                console.log(response)
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
        $(document).on('change keyup paste', '.to-slug', function (e) {
            try {
                $('.get-slug').val(app.toSlug($(this).val()))
            } catch (error) {
                console.error(error);
            }
        });
        $(document).on('click', '.btn-submit', function (e) {
            e.preventDefault();
            var self = $(this), parent = self.closest('.modal-content'), form = parent.find('form').first();
            if (form.length > 0) {
                form.submit();
            }
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
                beforeSend: options.beforeSend || function () { },
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            }).always(options.always || function () { });
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
    toSlug: function (str) {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();

        // xóa dấu
        str = str
            .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
            .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

        // Thay ký tự đĐ
        str = str.replace(/[đĐ]/g, 'd');

        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');

        // Xóa khoảng trắng thay bằng ký tự -
        str = str.replace(/(\s+)/g, '-');

        // Xóa ký tự - liên tiếp
        str = str.replace(/-+/g, '-');

        // xóa phần dư - ở đầu & cuối
        str = str.replace(/^-+|-+$/g, '');

        // return
        return str;
    }
}

$(function () {
    app.init();
});