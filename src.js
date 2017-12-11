var markers = [];

function initialize() {
    //48°12′N 16°22′E = 48.2, 16.366667
    var vienna = { lat: 48.2, lng: 16.366667 };
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: vienna
  });
    var coords;

    $('#markerForm').on('submit', function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var desc = $('#desc').val();
        var price = $('#price').val();
        $('#myModal').modal('hide');
        this.reset();
        addMarker(coords, map, name, desc, price);
    });

    google.maps.event.addListener(map, 'click', function(event) {
    $('#myModal').modal('show');
    coords = event.latLng;
  });
    restoreMarkers(map);
}

function addMarker(location, map, name, desc, price) {

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    marker.setTitle(name);
    marker.desc = desc;
    marker.price = price;
    marker.setAnimation(null);
    markers.push(marker);
    saveMarkers();
    printMarkers();
}

function printMarkers() {
    var tbody = document.getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";

    for(var i = 0; i < markers.length; i++) {
        var tr = document.createElement('tr');
        tr.addEventListener('mouseover', toggleBounce(i, true));
        tr.addEventListener('mouseout', toggleBounce(i, false));

        var removeCell = document.createElement('td');
        removeCell.innerHTML = '<button class="btn btn-danger" onClick="removeMarker('+i+')">Usuń</buttonn>';

        var nameCell = document.createElement('td');
        nameCell.innerHTML = markers[i].getTitle();

        var descCell = document.createElement('td');
        descCell.innerHTML = markers[i].desc;

        var priceCell = document.createElement('td');
        priceCell.innerHTML = markers[i].price;


        tr.appendChild(nameCell);
        tr.appendChild(descCell);
        tr.appendChild(priceCell);
        tr.appendChild(removeCell);
        tbody.appendChild(tr);
        markers[i].addListener('mouseover', toggleHover(tr, true));
        markers[i].addListener('mouseout', toggleHover(tr, false));
    }
}

function removeMarker(i) {
    markers[i].setMap(null);
    markers.splice(i, 1);
    saveMarkers();
    printMarkers();
}


function toggleBounce(i, on) {
    var marker = markers[i];
    return function() {
        if (!on) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

function toggleHover(row, on) {
    return function() {
        if(on) {
            row.classList.add("active")
        }
        else {
        row.classList.remove("active");
        }
    }
}

function saveMarkers() {

    var markersInfo = [];
    for(var i = 0; i < markers.length; i++) {
        var lat = markers[i].getPosition().lat();
        var lng = markers[i].getPosition().lng();
        var name = markers[i].getTitle();
        var desc = markers[i].desc;
        var price = markers[i].price;

        markersInfo.push({lat: lat, lng: lng, name: name, desc: desc, price: price});
    }

    localStorage.setItem("markers", JSON.stringify(markersInfo));
}

function restoreMarkers(map) {
    markersInfo = JSON.parse(localStorage.getItem("markers"));

    if(markersInfo)
        for(var i = 0; i < markersInfo.length; i++) {
            addMarker({lat: markersInfo[i].lat, lng:markersInfo[i].lng}, map, markersInfo[i].name, markersInfo[i].desc, markersInfo[i].price);
        }
}