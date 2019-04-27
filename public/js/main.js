$(document).ready(function(){

    //delete user
    $('.delete-user').on('click', function(e){
        $confirmation = confirm('Confirm deletion, All articles(if any) will be deleted permanently');
        if($confirmation){
            $target = $(e.target);
            const id = $target.attr('data-id');
            $.ajax({
                type: 'DELETE',
                url : '/user/delete/'+id,
                success: function(response){
                    window.location.href = '/';
                },
                error : function(err){
                    alert('Error Deleting User\n '+err);
                    
                }
            });
        }  
    });

    // delete article
    $('.delete-article').on('click', function(e){
        $confirmation = confirm('confirm deletion');
        if($confirmation){
            $target = $(e.target);
            const id = $target.attr('data-id');
            $.ajax({
                type : 'DELETE',
                url: '/article/delete/'+id,
                success: function(response){
                    window.location.href = '/article/articles';
                },
                error : function(err){
                    alert('Error deleting article\n'+err);
                    window.location.href = '/article/articles';
                }
            });
        }
    });
});