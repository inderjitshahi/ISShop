const deleteBtn=document.querySelector('.delete-btn');
const productElement =deleteBtn.closest('article');
deleteBtn.addEventListener('click',(e)=>{
    const csrfToken =deleteBtn.parentNode.querySelector('[name=_csrf]').value;
    const prodId=deleteBtn.parentNode.querySelector('[name=productId]').value;
    fetch('/admin/product/'+prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrfToken,
        }
    })
    .then(result=>{
        return result.json();
    })
    .then(data=>{
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err=>{
        console.log(err);
    })

})
