var app = {
    init: function () {
        this.events();
    },
    events: function () {
        $(document).on('click', '.popup', function (e) {
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
                var self = $(this), urlRequest = self.data('url') || '',
                    popup = $('#media-modal');

                if (urlRequest.trim().length > 0) {
                    app.fetchData({
                        url: urlRequest,
                        dataType: 'html',
                        type: 'GET'
                    }).then((response) => {
                        const modalContent = popup.find('.modal-body').first();
                        if (modalContent.length > 0) {
                            modalContent.html(response);
                            popup.modal('show');
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
        });
        $(document).on('submit', 'form[data-ajax="true"][data-type!="search"]', function (event) {
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
                    $('#modal').modal('toggle');
                    alert('Lưu dữ liệu thành công.');
                    if(response.cb){
                        app.bindTableData(response.cb)
                    }
                }
            });

            event.preventDefault();
        });
        $(document).on('submit', 'form[data-ajax="true"][data-type="search"]', function (event) {
            var form = $(this), destination = form.data('destination') || 'table-result';
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                dataType: 'html',
                beforeSend: function () {
                    form.find('label.form-check-label').text('');
                }
            }).done(function (response) {
                if (response.length > 0) {
                    $(`#${ destination }`).html(response);
                }
            });

            event.preventDefault();
        });
        $(document).on('change', 'input[name="files"]', function (e) {
            try {
                const self = $(this), form = self.closest('form').first();
                if (form.length > 0) {
                    formData = new FormData($(form)[0]);

                    var files = self[0].files;

                    for (var i = 0; i < files.length; i++) {
                        var filename = files[i].name,
                        fileSize = files[i].size;

                        var size = Math.round((fileSize / 1024));

                        if (size > 20*1024){
                            alert('File ảnh hợp lệ có dung lượng không vượt quá 20MB.');
                            return;
                        }
                        var extension = filename.substr(filename.lastIndexOf('.'));

                        var allowedExtensionsRegx = /(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/i;

                        var isAllowed = allowedExtensionsRegx.test(extension);

                        if (!isAllowed) {
                            alert('Vui lòng chọn file ảnh (.jpg, .jpeg, .png, .gif, .svg)');
                            return;
                        } 
                    }

                    $.ajax({
                        url: form.attr('action'),
                        type: form.attr('method'),
                        data: formData,
                        xhr: function () {
                            var fileXhr = $.ajaxSettings.xhr();
                            if (fileXhr.upload) {
                                $('.progress').show();
                                fileXhr.upload.addEventListener("progress", function (e) {
                                    if (e.lengthComputable) {
                                        var percentage = Math.ceil(((e.loaded / e.total) * 100));
                                        $('.progress-bar').text(percentage + '%');
                                        $('.progress-bar').width(percentage + '%');
                                        if (percentage == 100) {
                                            $('.progress-bar').text('100%');
                                        }
                                    }
                                }, false);
                            }
                            return fileXhr;
                        },
                        success: function (response) {

                            if(response.cb){
                                app.bindTableData(response.cb, 'table-media-result')
                            }
                            self.val('');
                            setTimeout(function () {
                                $('.progress').hide();
                            }, 100);
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                    return false;
                }
            } catch (error) {
                console.error(error);
            }
        });
        $(document).on('click', '.choose-image', function (e) {
            try {
                var self = $(this), name = self.data('name') || '', path = self.data('path') || '',
                inputImageCover = $('#modal').find('.image-cover').first()
                inputPath = $('#modal').find('input[name="image"]').first();
                
                if(inputPath.length > 0 && path.trim().length > 0){
                    inputPath.val(path);
                    inputImageCover.attr('src', path.startsWith('/') ? path : `/${ path }`);
                    $('#media-modal').modal('toggle');
                }
            } catch (error) {
                console.error(error);
            }
        });
        $(document).on('click', 'button[data-ajax="true"]', function (e) {
            try {
                var self = $(this), urlRequest = self.data('url') || '',
                method = self.data('method') || 'POST', dataType = self.data('type') || 'json',
                bindDataUrl = self.data('bind') || '';

                if(urlRequest.trim().length > 0){
                    app.fetchData({
                        type: method,
                        url: urlRequest,
                        dataType: dataType
                    }).then((response) => {
                        if(response.success){
                            if(bindDataUrl.trim().length > 0){
                                app.bindTableData(bindDataUrl);
                            }
                        }
                        else if(response.message){
                            alert(response.message);
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
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