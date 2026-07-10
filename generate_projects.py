import json
import html
import urllib.request

SKIP = {"Subash-Bikram-Tamang"}
USER_AGENT = "portfolio-generator"


def display_name(name):
    mapping = {
        "CoffeeShop-": "Doughy Delights Bakery",
        "ABHISHEK_METHODIST_CHURCH": "Abhishek Methodist Church",
        "AMC-Tanahun": "AMC Tanahun",
        "Weather_App": "Weather App",
        "Caesar-Cipher-": "Caesar Cipher",
        "Calculator-": "Calculator",
        "DilysisManagementSystem-": "Dialysis Management System",
        "LibaryManagment-Java-": "Library Management System",
        "Course_ManagmentSystem": "Course Management System",
        "PractiseJava": "Java Practice",
        "AI_2": "AI Notebook",
        "AMC": "AMC Church Website",
        "RoseDay": "Rose Day",
        "Quiz-App": "Quiz App",
        "Dice-Roll": "Dice Roll Game",
        "Data-Analysis": "Data Analysis",
        "Numerical-Methods-and-Concurrency": "Numerical Methods & Concurrency",
        "TheTimeBomb": "TheTimeBomb",
        "urbanharvest": "UrbanHarvest",
    }
    return mapping.get(name, name.replace("-", " ").replace("_", " ").strip())


DESCRIPTION_OVERRIDES = {
    "AMC": "Responsive church website with service times, outreach, and community engagement.",
    "AMC-Tanahun": "Church website variant for AMC Tanahun branch.",
    "RoseDay": "Special occasion website built with HTML, CSS, and JavaScript.",
    "AI_2": "Jupyter notebook exploring machine learning and data workflows.",
    "Data-Analysis": "Jupyter notebook project with statistical analysis and visualizations.",
    "Numerical-Methods-and-Concurrency": "C programs for linear regression, π estimation, prime finding, and image processing.",
    "Quiz-App": "Interactive Java quiz application with score tracking.",
    "urbanharvest": "Java platform for municipalities to help citizens trade and barter home-grown produce locally.",
}


def tag_for(lang):
    return {
        "HTML": "Web",
        "JavaScript": "Web",
        "Java": "Java",
        "Python": "Python",
        "C": "C",
        "Jupyter Notebook": "Data",
        "Other": "Other",
    }.get(lang or "Other", lang or "Other")


def tech_spans(lang, name=""):
    if name == "urbanharvest":
        return ["Java"]
    if lang == "Jupyter Notebook":
        return ["Python", "Jupyter"]
    if lang and lang != "Other":
        return [lang]
    return ["GitHub"]


def live_demo_url(name, homepage=None):
    return (homepage or f"https://vikramtamang.github.io/{name}/").rstrip("/") + "/"


def url_is_live(url):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return 200 <= response.status < 400
    except Exception:
        return False


def card(project, demo=False):
    tech = "".join(f"<span>{html.escape(t)}</span>" for t in project["tech"])
    code_label = "Code" if demo else "View Code"
    links = []
    if demo and project["deploy"]:
        links.append(
            f'<a href="{html.escape(project["deploy"])}" target="_blank" '
            f'rel="noopener noreferrer" class="btn-demo">'
            f'<i class="bx bx-link-external"></i> Live Demo</a>'
        )
    links.append(
        f'<a href="{html.escape(project["github"])}" target="_blank" '
        f'rel="noopener noreferrer" class="btn-code">'
        f'<i class="bx bxl-github"></i> {code_label}</a>'
    )
    return f"""            <div class="project-box">
                <div class="project-info">
                    <span class="project-tag">{html.escape(project["tag"])}</span>
                    <h4>{html.escape(project["title"])}</h4>
                    <p>{html.escape(project["desc"])}</p>
                    <div class="project-tech">{tech}</div>
                    <div class="project-links">{"".join(links)}</div>
                </div>
            </div>"""


url = "https://api.github.com/users/VikramTamang/repos?per_page=100&sort=updated"
with urllib.request.urlopen(url) as response:
    repos = [repo for repo in json.load(response) if repo["name"] not in SKIP]

deployable = []
code_only = []

for repo in repos:
    name = repo["name"]
    deploy = ""
    if repo.get("has_pages"):
        candidate = live_demo_url(name, repo.get("homepage"))
        if url_is_live(candidate):
            deploy = candidate

    entry = {
        "name": name,
        "title": display_name(name),
        "desc": DESCRIPTION_OVERRIDES.get(
            name,
            (repo.get("description") or f"Project repository: {display_name(name)}.").strip(),
        ),
        "tag": tag_for(repo.get("language")),
        "tech": tech_spans(repo.get("language"), name),
        "github": repo["html_url"],
        "deploy": deploy,
    }

    if deploy:
        deployable.append(entry)
    else:
        code_only.append(entry)

deployable.sort(key=lambda item: item["title"].lower())
code_only.sort(key=lambda item: item["title"].lower())

featured_html = "\n\n".join(card(project, True) for project in deployable)
more_html = "\n\n".join(card(project, False) for project in code_only)

output = f"""        <h3 class="projects-group-title">Featured — Live Demos ({len(deployable)})</h3>
        <div class="projects-container">

{featured_html}

        </div>

        <h3 class="projects-group-title">More Projects ({len(code_only)})</h3>
        <div class="projects-container">

{more_html}

        </div>"""

with open("projects-section.html", "w", encoding="utf-8") as file:
    file.write(output)

with open("index.html", "r", encoding="utf-8") as file:
    index_html = file.read()

projects_start = index_html.find('<section class="projects" id="projects">')
contact_start = index_html.find('<section class="contact" id="contact">')
if projects_start == -1 or contact_start == -1:
    raise SystemExit("Could not find projects section in index.html")

projects_end = index_html.rfind("</section>", projects_start, contact_start) + len("</section>")

projects_header = """    <section class="projects" id="projects">
        <h2 class="heading">Projects</h2>
        <p class="projects-subtitle">Featured web projects with live demos, plus coursework and personal builds on
            GitHub.</p>

"""

updated_index = (
    index_html[:projects_start]
    + projects_header
    + output
    + "\n\n    </section>\n\n"
    + index_html[projects_end:]
)
with open("index.html", "w", encoding="utf-8") as file:
    file.write(updated_index)

print(f"Generated {len(deployable)} deployable + {len(code_only)} code-only projects")
print("Updated index.html and projects-section.html")
