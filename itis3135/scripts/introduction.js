const DEFAULT_IMAGE = 'images/pic_for_intro_450x600.jpg';

const DEFAULT_COURSES = [
    { dept: 'ITIS', num: '3135', name: 'Frontend Programming',    reason: 'required, reduce workload for fall & spring' },
    { dept: 'ITSC', num: '3155', name: 'Software Engineering',    reason: 'required, reduce workload for fall & spring' },
    { dept: 'ITIS', num: '3130', name: 'Human Centered Computing',reason: 'required, reduce workload for fall & spring' }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Course management ─────────────────────────────────────────────────────────

function addCourse(dept, num, name, reason) {
    dept   = dept   || '';
    num    = num    || '';
    name   = name   || '';
    reason = reason || '';
    const container = document.getElementById('courses-container');
    const div = document.createElement('div');
    div.className = 'course-entry';
    div.innerHTML = `
        <input type="text" name="courseDept"   placeholder="Dept (e.g. ITIS)"   value="${escAttr(dept)}">
        <input type="text" name="courseNum"    placeholder="Number (e.g. 3135)" value="${escAttr(num)}">
        <input type="text" name="courseName"   placeholder="Course name"        value="${escAttr(name)}">
        <input type="text" name="courseReason" placeholder="Reason for taking"  value="${escAttr(reason)}">
        <button type="button" class="remove-course-btn">Remove</button>
    `;
    div.querySelector('.remove-course-btn').addEventListener('click', () => div.remove());
    container.appendChild(div);
}

// ── Clear ─────────────────────────────────────────────────────────────────────

function clearForm() {
    const form = document.getElementById('intro-form');
    form.querySelectorAll('input:not([type="file"]), textarea').forEach((el) => {
        el.value = '';
    });
    const fileInput = form.querySelector('[name="picture"]');
    if (fileInput) {
        const clone = fileInput.cloneNode(true);
        fileInput.replaceWith(clone);
    }
}

// ── Gather data ───────────────────────────────────────────────────────────────

function gatherData() {
    const form = document.getElementById('intro-form');
    const val  = (name) => (form.querySelector(`[name="${name}"]`) || {value: ''}).value.trim();

    const bullets = [];
    for (let i = 1; i <= 7; i++) {
        const label   = val(`bulletLabel${i}`);
        const content = val(`bulletContent${i}`);
        if (content) bullets.push({ label, content });
    }

    const courses = Array.from(form.querySelectorAll('.course-entry')).map((entry) => ({
        dept:   entry.querySelector('[name="courseDept"]').value.trim(),
        num:    entry.querySelector('[name="courseNum"]').value.trim(),
        name:   entry.querySelector('[name="courseName"]').value.trim(),
        reason: entry.querySelector('[name="courseReason"]').value.trim()
    }));

    const links = [];
    for (let i = 1; i <= 5; i++) {
        links.push({ label: val(`linkLabel${i}`), url: val(`linkUrl${i}`) });
    }

    return {
        firstName:         val('firstName'),
        middleName:        val('middleName'),
        nickname:          val('nickname'),
        lastName:          val('lastName'),
        acknowledgment:    val('acknowledgment'),
        ackDate:           val('ackDate'),
        mascotAdj:         val('mascotAdj'),
        mascotAnimal:      val('mascotAnimal'),
        divider:           val('divider'),
        pictureCaption:    val('pictureCaption'),
        personalStatement: val('personalStatement'),
        bullets,
        courses,
        quote:             val('quote'),
        quoteAuthor:       val('quoteAuthor'),
        funnyThing:        val('funnyThing'),
        shareInfo:         val('shareInfo'),
        links
    };
}

// ── Build & show result ───────────────────────────────────────────────────────

function buildAndShowResult(data, imgSrc) {
    const result        = document.getElementById('intro-result');
    const formContainer = document.getElementById('form-container');

    const nameParts = [data.firstName];
    if (data.middleName) nameParts.push(data.middleName);
    nameParts.push(data.lastName);
    const fullName    = nameParts.join(' ');
    const nameDisplay = data.nickname ? `${fullName} (${data.nickname})` : fullName;

    const bulletsHtml = data.bullets
        .map((b) => `<li><b>${esc(b.label)}:</b> ${esc(b.content)}</li>`)
        .join('\n            ');

    const validCourses = data.courses.filter((c) => c.name);
    const coursesHtml  = validCourses.length > 0 ? `
            <li>
                <b>Courses I'm Taking, &amp; Why: </b>
                <ul>
                    ${validCourses.map((c) =>
                        `<li><b>${esc(c.dept)}${esc(c.num)} - ${esc(c.name)}:</b> ${esc(c.reason)}</li>`
                    ).join('\n                    ')}
                </ul>
            </li>` : '';

    const ackHtml   = data.acknowledgment
        ? `<p><em>${esc(data.acknowledgment)}</em>${data.ackDate ? ` &mdash; ${esc(data.ackDate)}` : ''}</p>` : '';

    const stmtHtml  = data.personalStatement
        ? `<p>${esc(data.personalStatement)}</p>` : '';

    const quoteHtml = data.quote ? `
        <blockquote>
            <p>&ldquo;${esc(data.quote)}&rdquo;</p>
            ${data.quoteAuthor ? `<cite>&mdash; ${esc(data.quoteAuthor)}</cite>` : ''}
        </blockquote>` : '';

    const funnyHtml = data.funnyThing
        ? `<p><b>Fun fact:</b> ${esc(data.funnyThing)}</p>` : '';
    const shareHtml = data.shareInfo
        ? `<p><b>Something I'd like to share:</b> ${esc(data.shareInfo)}</p>` : '';

    const validLinks = data.links.filter((l) => l.url);
    const linksHtml  = validLinks.length > 0
        ? `<p>${validLinks.map((l) => `<a href="${esc(l.url)}">${esc(l.label || l.url)}</a>`).join(' | ')}</p>`
        : '';

    result.innerHTML = `
        ${ackHtml}
        <figure>
            <img class="picture" src="${imgSrc}" alt="personal picture">
            <figcaption>${esc(data.pictureCaption)}</figcaption>
        </figure>
        ${stmtHtml}
        <ul>
            ${bulletsHtml}
            ${coursesHtml}
        </ul>
        ${quoteHtml}
        ${funnyHtml}
        ${shareHtml}
        ${linksHtml}
        <p><a href="#" id="reset-link">&#8635; Start over</a></p>
    `;

    formContainer.style.display = 'none';
    result.style.display = 'block';

    document.getElementById('reset-link').addEventListener('click', (e) => {
        e.preventDefault();
        result.style.display = 'none';
        result.innerHTML = '';
        formContainer.style.display = 'block';
    });
}

// ── Submit ────────────────────────────────────────────────────────────────────

function handleSubmit() {
    const form = document.getElementById('intro-form');

    for (const field of form.querySelectorAll('[required]')) {
        if (!field.value.trim()) {
            field.focus();
            const label = form.querySelector(`label[for="${field.id}"]`);
            const name  = label ? label.textContent.replace('*', '').trim() : field.name;
            alert(`Please fill in the required field: ${name}`);
            return;
        }
    }

    const fileInput = form.querySelector('[name="picture"]');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => buildAndShowResult(gatherData(), e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        buildAndShowResult(gatherData(), DEFAULT_IMAGE);
    }
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    DEFAULT_COURSES.forEach((c) => addCourse(c.dept, c.num, c.name, c.reason));

    const form = document.getElementById('intro-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit();
    });

    document.getElementById('add-course-btn').addEventListener('click', () => addCourse());
    document.getElementById('clear-btn').addEventListener('click', clearForm);
});
