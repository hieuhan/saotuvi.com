$(document).ready(function() {
    $(document).on("click","#user-create",function(e) {
        e.preventDefault();
        $.ajax({
            url: '/stv/user/create',
            dataType: 'html',
            success: function(data){
                const modalContent = $("#modal").find('.modal-content').first();
                modalContent.html(data);
                $("#modal").modal('show');
            }
        })
    });

    $(document).on('submit', 'form[data-ajax="true"]', function(event){
        var form = $(this);
        $.ajax({
          type: "POST",
          url: form.attr('action'),
          data: form.serialize(),
          dataType: "html",
        }).done(function (data) {
            const modalContent = $("#modal").find('.modal-content').first();
            modalContent.html(data);
            $("#modal").modal('show');
        });
    
        event.preventDefault();
    })
});