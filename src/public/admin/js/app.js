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
    }
}

$(function () {
    app.init();
});