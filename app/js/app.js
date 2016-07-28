var url = 'http://seq-front-end-assessment.s3-website-us-west-2.amazonaws.com/catalog.json';

function loadProducts(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.addEventListener('load', function(response) {
		if(xhr.status < 400) {
			callback(xhr.response);
			// console.log(xhr.response);
		} else {
			callback(null);
		}
	});

	xhr.send(null);
}

function loadProduct(url, index, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.addEventListener('load', function(response) {
		if(xhr.status < 400) {
			callback(xhr.response, index);
		} else {
			callback(null);
		}
	});

	xhr.send(null);
}

loadProducts(url, createProductSlide);


function createProductSlide(res) {
	var data = JSON.parse(res);
	$.each(data.products, function( index, prod ) {
	  var slide = createSlide(prod);
	  $('#main-sldr').append(slide);
	  $('.selectors').append(createSelectors);
	});
		
	$( '.sldr' ).each(createSlider);
}

function getProductInfo(res, idx) {
	var data = JSON.parse(res);
	data = data.products[idx - 1];
	createModal(data);
}

function parseProductName(obj){
	var name = obj.name.split(' ');
	var modelName = '';
	var modelNumber = '';
	var result = [];

	name.forEach(function(item, idx){
		if(idx >= 3) {
			modelName += item;
		}
		else if(idx == 2) {
			modelNumber += item;
		} else {
			return null;
		}
	});
	result.push(modelName);
	result.push(modelNumber);
	return result;
}

function createSlide(product) {

	var name = parseProductName(product);

	var slide = '<li class="elmnt-' + name[1] + '" data-id="' + name[1] + '"><div class="product-name"><span class="model-number">';
	slide += 'Model No. ' + name[1] + '</span><span class="model-name">';
	slide += name[0] + '</span></div><img src="';
	slide += '.' + product.images[0]['main-view'] + '"></li>';

	return slide;
}

function createSelectors() {
	return '<li><a href="">•</a></li>';
}

function createModal(product) {
	$('.sub-slider').remove();
    $('.info').remove();

	var name = parseProductName(product);
	var modal = '<div class="sub-slider"><img src=".' + product.images[0]['main-view'] + '" alt="">';
	modal += '<div class="thumbnails"><ul><li><img src=".' + product.images[0]['main-view'] + '" alt="">';
	modal += '</li><li><span class="overlay"></span><img src=".' + product.images[0]['main-view'] + '" alt="">';
	modal +='</li><li><span class="overlay"></span><img src=".' + product.images[0]['main-view'] + '" alt=""></li>';
	modal +='<li><span class="overlay"></span><img src=".' + product.images[0]['main-view'] + '" alt=""></li>';
	modal += '<li><span class="overlay"></span><img src=".' + product.images[0]['main-view'] + '" alt=""></li></ul></div>'
	modal += '</div><div class="info">';
	modal += '<div class="main-info">';
	modal += '<h1 class="title">' + name[0] + '</h1>';
	modal += '<p class="desc">' + product.description + '</p></div>';
	modal += '<div class="specs"><hr><h3>specs & mechanics</h3><table><tbody><tr><td>gearing</td><td class="align-right">freewheel</td></tr>';
	modal += '<tr><td>handlebar</td><td class="align-right">bullhorn</td></tr><tr><td>framesize</td><td class="align-right">5\'4" - 5\'11"</td></tr></tbody></table>';
	modal += '<button>buy now - $' + product.price + '</button></div></div>';
	$('#productModal > .modal-content').append(modal);
}

$('#quick-view').click(function(e) {
	var id = $('li.focalPoint').data('id');
	var id = parseInt(id, 10);
	loadProduct(url, id, getProductInfo);
});
