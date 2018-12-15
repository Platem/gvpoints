const Section = (key, name, score, img) => $(`
    <section key="${key}">
        <img src="${img}" alt="">
        <p>${name} <span class="score">${score}</span></p>
        <div class="controls">
            <button class="minus">-</button>
            <button class="plus">+</button>
        </div>
    </section>
`);

let db = firebase.firestore();

$(function() {
    $(document).on('click', '.minus', function(e) {
        const $section = $(e.target).parents('section')
        const key = $section.attr('key');
        const score = parseInt($section.find('span.score').text()) - 1;
        
        db.collection('vibers').doc(key).set({ score: score }, { merge: true });
    });

    $(document).on('click', '.plus', function(e) {
        const $section = $(e.target).parents('section')
        const key = $section.attr('key');
        const score = parseInt($section.find('span.score').text()) + 1;
        
        db.collection('vibers').doc(key).set({ score: score }, { merge: true });
    });

    db.collection('vibers')
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const data = doc.data();

            let $section = $(`section[key="${doc.id}"]`);

            if ($section.length < 1) {
                $section = Section(doc.id, data.name, data.score, data.img);
                $('#main').append($section);
            } else {
                $section.find('span.score').text(data.score);
            }
        });
    });
});
