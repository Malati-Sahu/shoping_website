const WHATSAPP_NUMBER = "916375801927"; // Replace with the shop's WhatsApp number if needed.

const products = [
  {id:1,name:"Aura Everyday Tote",category:"Accessories",price:799,oldPrice:999,discount:20,description:"A clean, versatile everyday tote designed for work, shopping and daily use.",colors:["#d7e0da","#d8d0c4"]},
  {id:2,name:"Luna Ceramic Set",category:"Home",price:649,oldPrice:799,discount:19,description:"Minimal ceramic pieces that add a warm, refined touch to your everyday space.",colors:["#e8ddd0","#b6c1bc"]},
  {id:3,name:"Sage Everyday Set",category:"Lifestyle",price:599,oldPrice:749,discount:20,description:"A practical lifestyle essential with a simple design made for everyday routines.",colors:["#cbd8ce","#8fa399"]},
  {id:4,name:"Noir Signature Box",category:"Gifting",price:999,oldPrice:1299,discount:23,description:"A thoughtfully arranged gift set for birthdays, celebrations and special moments.",colors:["#373a38","#7c827d"]},
  {id:5,name:"Olive Home Accent",category:"Home",price:449,oldPrice:549,discount:18,description:"A subtle decorative accent that brings texture and character to your home.",colors:["#d5d8c9","#8c947c"]},
  {id:6,name:"Cove Travel Essential",category:"Lifestyle",price:899,oldPrice:1099,discount:18,description:"Compact, useful and made to travel with you wherever the day takes you.",colors:["#d9d5ce","#a4a095"]},
  {id:7,name:"Mira Daily Pouch",category:"Accessories",price:399,oldPrice:499,discount:20,description:"A lightweight pouch for keeping your everyday essentials organized.",colors:["#e3d6cc","#b68e7e"]},
  {id:8,name:"Classic Gift Edit",category:"Gifting",price:749,oldPrice:899,discount:17,description:"A ready-to-gift collection with an understated, premium presentation.",colors:["#ddd9d0","#9b9487"]}
];

let cart = JSON.parse(localStorage.getItem("veloraCart") || "[]");
let selectedCategory = "All";

const money = n => `₹${n.toLocaleString("en-IN")}`;
const productById = id => products.find(p => p.id === id);

function productStyle(p){
  return `--bg:linear-gradient(135deg,${p.colors[0]},${p.colors[1]});--obj:${p.colors[0]};`;
}
function renderCategories(){
  const cats = ["Accessories","Home","Lifestyle","Gifting"];
  document.getElementById("categoryGrid").innerHTML = cats.map(c => `
    <button class="category-card" onclick="filterCategory('${c}')">
      <span><strong>${c}</strong><small>${products.filter(p=>p.category===c).length} products</small></span>
    </button>`).join("");
}
function renderFilters(){
  const cats = ["All",...new Set(products.map(p=>p.category))];
  document.getElementById("filters").innerHTML = cats.map(c =>
    `<button class="filter ${selectedCategory===c?"active":""}" onclick="filterCategory('${c}')">${c}</button>`
  ).join("");
}
function renderProducts(){
  const list = selectedCategory==="All" ? products : products.filter(p=>p.category===selectedCategory);
  document.getElementById("productGrid").innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-img" style="${productStyle(p)}" onclick="openProduct(${p.id})">
        <span class="badge">${p.discount}% OFF</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    </article>`).join("");
}
function filterCategory(c){selectedCategory=c;renderFilters();renderProducts();scrollToProducts();}
function showAllProducts(){filterCategory("All")}
function scrollToProducts(){document.getElementById("products").scrollIntoView({behavior:"smooth"});}
function scrollToCategories(){document.getElementById("categories").scrollIntoView({behavior:"smooth"});}
function goHome(){window.scrollTo({top:0,behavior:"smooth"});}

function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(); updateCartCount(); toast("Added to your cart");
}
function saveCart(){localStorage.setItem("veloraCart",JSON.stringify(cart));}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function cartTotal(){return cart.reduce((s,x)=>{const p=productById(x.id);return s+p.price*x.qty},0);}
function openCart(){renderCart();document.getElementById("overlay").classList.add("open");}
function closeCart(){document.getElementById("overlay").classList.remove("open");}
function closePanels(e){if(e.target.id==="overlay")closeCart();}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();updateCartCount();renderCart();renderCheckoutSummary();
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();updateCartCount();renderCart();}
function renderCart(){
  const box=document.getElementById("cartItems"), summary=document.getElementById("cartSummary"), btn=document.getElementById("checkoutBtn");
  if(!cart.length){
    box.innerHTML=`<div style="padding:55px 10px;text-align:center;color:#888"><div style="font-size:42px">🛍</div><h3>Your cart is empty</h3><p>Add a few products to get started.</p></div>`;
    summary.innerHTML="";btn.disabled=true;btn.style.opacity=".45";return;
  }
  btn.disabled=false;btn.style.opacity="1";
  box.innerHTML=cart.map(x=>{const p=productById(x.id);return `
    <div class="cart-item">
      <div class="mini-img" style="${productStyle(p)}"></div>
      <div><h4>${p.name}</h4><small>${money(p.price)} each</small>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div>
        <button class="remove" onclick="removeFromCart(${p.id})">Remove</button>
      </div>
      <strong>${money(p.price*x.qty)}</strong>
    </div>`}).join("");
  summary.innerHTML=`<div class="sum-row"><span>Subtotal</span><strong>${money(cartTotal())}</strong></div><div class="sum-row"><span>Delivery</span><span>Confirmed on WhatsApp</span></div><div class="sum-row total"><span>Total</span><span>${money(cartTotal())}</span></div>`;
}
function openProduct(id){
  const p=productById(id);
  document.getElementById("productDetail").innerHTML=`
    <div class="detail-grid">
      <div class="detail-image" style="${productStyle(p)}"></div>
      <div class="detail-copy">
        <span class="eyebrow">${p.category.toUpperCase()}</span>
        <h2>${p.name}</h2>
        <p class="desc">${p.description}</p>
        <div class="detail-price">${money(p.price)} <span class="old-price">${money(p.oldPrice)}</span></div>
        <div class="quantity-control"><button onclick="detailQty(-1)">−</button><span id="detailQty">1</span><button onclick="detailQty(1)">+</button></div>
        <button class="btn btn-dark full" onclick="addDetailToCart(${p.id})">Add to cart</button>
      </div>
    </div>`;
  document.getElementById("productModal").classList.add("open");
}
let detailQuantity=1;
function detailQty(d){detailQuantity=Math.max(1,detailQuantity+d);document.getElementById("detailQty").textContent=detailQuantity;}
function addDetailToCart(id){for(let i=0;i<detailQuantity;i++)addToCart(id);detailQuantity=1;closeProduct();}
function closeProduct(e){if(!e || e.target.id==="productModal")document.getElementById("productModal").classList.remove("open");}

function openCheckout(){
  if(!cart.length){toast("Your cart is empty");return;}
  closeCart();renderCheckoutSummary();document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout(e){if(!e || e.target.id==="checkoutModal")document.getElementById("checkoutModal").classList.remove("open");}
function renderCheckoutSummary(){
  const box=document.getElementById("checkoutSummary"); if(!box)return;
  box.innerHTML=`<h3>Order summary</h3>`+cart.map(x=>{const p=productById(x.id);return `<div class="checkout-line"><span>${p.name} × ${x.qty}</span><strong>${money(p.price*x.qty)}</strong></div>`}).join("")+
  `<div class="sum-row total"><span>Total</span><span>${money(cartTotal())}</span></div>`;
}
function placeOrder(e){
  e.preventDefault();
  if(!cart.length)return;
  const data=new FormData(e.target);
  let message=`Hello, I would like to place an order.%0A%0A*Order Details*%0A`;
  cart.forEach(x=>{const p=productById(x.id);message+=`• ${p.name} × ${x.qty} — ${money(p.price*x.qty)}%0A`;});
  message+=`%0A*Total: ${money(cartTotal())}*%0A%0A*Customer Details*%0AName: ${encodeURIComponent(data.get("name"))}%0APhone: ${encodeURIComponent(data.get("phone"))}%0AAddress: ${encodeURIComponent(data.get("address"))}%0ACity: ${encodeURIComponent(data.get("city"))}%0APincode: ${encodeURIComponent(data.get("pincode"))}%0A%0APlease confirm my order.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
  cart=[];saveCart();updateCartCount();e.target.reset();closeCheckout();toast("Opening WhatsApp…");
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
document.getElementById("footerWhatsapp").href=`https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById("heroImage").style.background="linear-gradient(135deg,#dce7df,#9fb2a7)";
renderCategories();renderFilters();renderProducts();updateCartCount();
