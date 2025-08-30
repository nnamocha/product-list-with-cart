  document.addEventListener('DOMContentLoaded',()=>{

    fetchAPI()

    
    

  })

  const fetchAPI = async ()=> {
      const url = './data.json';

      try{
          const api = await fetch(url);
          const responses = await api.json();
          console.log(responses)
          updateDOM(responses)
          addCart(responses)
          remove()
          confirm()
        

          
      }
    

      catch(error){
          console.log(error)
      }
    

  }

  const updateDOM = (data) =>{
      const elements = document.querySelector('.elements')

      let HTMLContent =''
      data.map((eachProduct)=>{
          
          let product = `
                <aside class="item">
          <figure class="dessertImage">
            <img src="${eachProduct.image.desktop}" alt="">
          </figure>
          <article class="addCart">
            <div class="notClicked">
              <img src="./assets/images/icon-add-to-cart.svg" alt="">
              <p>Add to cart</p>
            </div>
            <div class="clicked">
              <figure class="decrease">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="">
              </figure>
              <p class="number">1</p>
              <figure class="increase">
                <img src="./assets/images/icon-increment-quantity.svg" alt="">
              </figure>
            </div>
          </article>


          <article class="description">
            <p class="name">${eachProduct.category}</p>
            <p class="fName">${eachProduct.name}</p>
            <p class="price">$${eachProduct.price}</p>
          </article>


        </aside>
        
      </article>
          `
          HTMLContent += product
      })
      elements.innerHTML = HTMLContent


  }




    const cartItemObj = {};

  function addCart(){
    const productItem = document.querySelectorAll('.item');
    


    productItem.forEach(element => {
      const defaultCart = element.querySelector('.notClicked') 
      const plus = element.querySelector('.increase') 
      const minus = element.querySelector('.decrease') 
      let quantity = element.querySelector('.number')
      const addCartBTN = element.querySelector('.addCart')
      const image = element.querySelector('.dessertImage')

      defaultCart.addEventListener('click', (event) => {
        if (defaultCart.contains(event.target)) {
          element.classList.add('highlight')
        }
      

        const fullCart = document.querySelector('.fullCart')
        const emptyCart = document.querySelector('.emptyCart') 
        const cartNo = document.querySelector('.cartNo')


        //the cart to show when clicked
        fullCart.style.display='flex'
        emptyCart.style.display ='none'
        
        const itemName = element.querySelector('.name')
        const itemFname = element.querySelector('.fName')
        const itemPrice =element.querySelector('.price')
        
        


        const text = itemPrice.textContent.replace('$','') 
        const num = parseFloat(text)
          

          
          const productName = itemName.textContent;
          const productFullName = itemFname.textContent;
          const productPrice = num;
          let productQuantity = quantity.textContent;
          let productImage = image.innerHTML;         


            cartItemObj[productName] = {
              name: `${productFullName}`,
              price: `${parseFloat(productPrice)}`,
              quantity: `${parseFloat(productQuantity)}`,
              image : `${productImage}`,
              totalPrice : `${parseFloat(productPrice) *parseFloat( productQuantity)}`
            }
          // }



        plus.addEventListener('click',()=>{
        quantity.textContent++

          
          
         for(const key in cartItemObj){
          
          if(key === element.querySelector('.name').textContent){
            cartItemObj[key].quantity++;
            updateCart()
            totalOrder()
            remove()
          }
          else{
            updateCart()
            totalOrder()
            remove()
          }
         }
          
        })

        minus.addEventListener('click',()=>{
        
          if(quantity.textContent>1){
            quantity.textContent--
              for(const key in cartItemObj){
                if(key === element.querySelector('.name').textContent){
                  cartItemObj[key].quantity--;
                  // console.log(cartItemObj);
                  updateCart()
                  totalOrder()
                  remove()
                }
                else{
                  updateCart()
                  totalOrder()
                  remove()
                }
         }

         }
        })
        totalOrder()        
        updateCart()
        remove(element)

      })    
      

    });

}
  addCart()

  function updateCart (){
    const itemCart = document.querySelector('.itemCart')
    let content =''
    Object.entries(cartItemObj).map(([key,value]) => {

      let eachCartItem =`
        <section class="cartItem">
          <div>
          <p class="nameCart">${value['name']}</p>
          <aside class="rates">
            <p class="freq">${value['quantity']}x</p>
            <p class="priceCart">@$${value['price']}</p>
            <p class="totalPrice">$${value['price']* value['quantity']}</p>
          </aside>
        </div>
          <figure class="remove">
            <img src="./assets/images/icon-remove-item.svg" alt="">
          </figure>
          <span style="display:none;" class='productName'>${key}</span>
        </section>
        <hr>`

        content += eachCartItem;
        itemCart.innerHTML = content 


      
    //  remove()
    }) 


  }
  
 function totalOrder (){
    const totalOrderNO = document.querySelector('#orderPrice')
    const cartNo = document.querySelector('.cartNo')

    let orderTotal = 0
    for (const key in cartItemObj){
      orderTotal+= cartItemObj[key].price * cartItemObj[key].quantity 
    }
     totalOrderNO.textContent = '$' +orderTotal
    let noCart = 0
      for (const key in cartItemObj){
        noCart += Number( cartItemObj[key].quantity) ;
                
        cartNo.textContent = noCart;
       updateCart()
       remove()
        
    }  


 }
 function remove(element) {
  const removeBtn = document.querySelectorAll('.remove')
  const fullCart = document.querySelector('.fullCart')
  const emptyCart = document.querySelector('.emptyCart')   
  
    removeBtn.forEach(eachRemove =>{
      eachRemove.addEventListener('click',(event)=>{
          // console.log(event.target);
          
          let key = eachRemove.nextElementSibling
          let productName = key.textContent   

          delete(cartItemObj[productName])
          console.log(element);
          if(element){
          element.classList.remove('highlight')
          }
          else{
            
          }
          if(Object.keys(cartItemObj).length === 0){

            fullCart.style.display='none'
            emptyCart.style.display ='flex'
            totalOrder()
            updateCart()
            remove()
          }

            updateCart()
            totalOrder()        
          
            })
          
        })
        
  }
  function confirm (){
    const confirnBtn = document.querySelector('.confirm')
    const overLay = document.querySelector('.overlay')
    const confirmed = document.querySelector('.confirmed')
    const startOrder = document.querySelector('.startOrder')
    const food = document.querySelector('.list')
    const totalPrice = document.querySelector('.confirmOrder h2')
    const orderPrice = document.querySelector('#orderPrice')    
    
    confirnBtn.addEventListener('click', ()=>{
      overLay.style.display ="flex"
      confirmed.style.display ='flex'

      Object.entries(cartItemObj).map(([key,value]) => {

      let orderList = `
            <section class="confirmItem">
        <aside class="left">
        <figure class="image">${value['image']}</figure>
        <aside class="details">
          <h4 class="confirmName">${value['name']}</h4>
          <aside class="quantity">
            <p class="much">${value['quantity']}x </p>
            <p class="confirmPrice">@$${value['price']}</p>

          </aside>
          </aside>
           </aside>
          <aside class="confirmTotalPrice">
            $${value['quantity'] * value['price']}
          </aside>

          </section>
      <hr>
      `
      food.innerHTML += orderList

      totalPrice.textContent = orderPrice.textContent
      })
    })

    startOrder.addEventListener('click', ()=>{
      location.reload()
    })
  }

