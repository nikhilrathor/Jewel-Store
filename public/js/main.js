$(function(){
    if($('textarea#ta').length){
        CKEDITOR.replace('ta');
    }

    $('a.ConfirmDeletion').on('click',function(){
        if(!confirm('Confirm Deletion'))
        return false;
    })

    $('a.clearcart').on('click', function () {
        if (!confirm('Confirm Clear Cart'))
            return false;
    })
})