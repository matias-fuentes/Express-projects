import { ProjectList } from './classes/projectList';
import { Project, ProjectType } from './classes/project';

/* projectInputTemplate it's a template from index.html between the lines 13 and 29 that I use to move
and show in the DOM. All the elements within the <template></template> tags, by default are not being
rendered in the DOM, so you have to extract their content, copy it, and use it on wherever you want.
The 'app' const it's the root of my application. */
const projectInputTemplate = document.getElementById('project-input')! as HTMLTemplateElement;
const app = document.getElementById('app')! as HTMLDivElement;

/* Here I extract the content from the templates from before... */
const projectInput = projectInputTemplate.content.children[0]! as HTMLElement;
projectInput.id = 'user-input';

/* ...and insert it in my root. */
app.insertBefore(projectInput, app.firstChild);

new ProjectList('active');
new ProjectList('finished');

export const titleInput = document.getElementById('title')! as HTMLInputElement;
export const descriptionInput = document.getElementById('description')! as HTMLInputElement;
export const peopleInput = document.getElementById('people')! as HTMLInputElement;

const button = document.querySelector('button')! as HTMLButtonElement;
/* When we click the button to add a new project... */
button.addEventListener('click', e => {
    e.preventDefault();

    const id = Math.random().toString();
    const title = titleInput.value;
    const description = descriptionInput.value;
    const people = +peopleInput.value;

    const projectObj: ProjectType = {
        id,
        title,
        description,
        people,
    };

    /* ...then a new project is created! And all thanks to creating a new instance of the Project class. */
    new Project(projectObj);
});

/* Keeping a counter of the times that we are entering (dragenter) and leaving (dragleave) the children
of the same element, we can determine whether or not to show the droppable class.

Remember that the droppable class is in charge of giving the feedback to the user whether it's dragging
the project onto the active projects list (a red background will be shown) or onto the finished projects list
(a blue background instead will be shown). */

let counter = 0;
const activeProjectsList = document.getElementById('active-projects-list')! as HTMLElement;
const finishedProjectsList = document.getElementById('finished-projects-list')! as HTMLElement;
const projectsListArray: [HTMLElement, HTMLElement] = [activeProjectsList, finishedProjectsList];

const activeProjects = activeProjectsList.children[1] as HTMLUListElement;
const finishedProjects = finishedProjectsList.children[1] as HTMLUListElement;

/* The main difference between the 'projectsList' and the 'projects' elements, it's that projectsList
contains both header (the colored label, either red or blue with the name of the project list) and the ul
element, being the ul element part of the 'projects' element. So:

<section class="projects" id="active-projects-list"> -> 'projectsList' element
    <header>
        <h2>ACTIVE PROJECTS</h2>
    </header>
    <ul id="active-projects"> -> 'projects' element
        ...
    </ul>
</section> */

/* This forEach is in charge of handling the drag event. */
projectsListArray.forEach(projectList => {
    /* Needed for handling the drop event and for IE compatibility. */
    projectList.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
    });

    projectList.addEventListener('dragenter', (e: DragEvent) => {
        counter++;

        if (projectList === activeProjectsList) {
            activeProjects.classList.add('droppable');
        } else {
            finishedProjects.classList.add('droppable');
        }

        console.log(e);
    });

    projectList.addEventListener('dragleave', () => {
        counter--;

        if (counter === 0) {
            if (projectList === activeProjectsList) {
                activeProjects.classList.remove('droppable');
            } else {
                finishedProjects.classList.remove('droppable');
            }
        }
    });

    projectList.addEventListener('drop', (e: DragEvent) => {
        counter = 0;

        if (projectList === activeProjectsList) {
            activeProjects.classList.remove('droppable');
        } else {
            finishedProjects.classList.remove('droppable');
        }

        /* draggedProjectList = The list (either active or finished) where the dragged project belongs
        BEFORE being dropped. */
        const projectId = e.dataTransfer!.getData('text/plain');
        const draggedProject = document.getElementById(projectId)! as HTMLLIElement;
        const draggedProjectList = draggedProject.parentElement!.id;
        /* If the dragged project is dropped ONLY on the other list from where it belongs, then we append
        that project on the new list. If it's dropped outside of a list or if it's dropped on the same list from
        where it belongs, then we don't do anything and we leave it as it is. */
        if (draggedProjectList === 'active-projects' && projectList !== activeProjectsList) {
            finishedProjects.appendChild(draggedProject);
        } else if (draggedProjectList === 'finished-projects' && projectList !== finishedProjectsList) {
            activeProjects.appendChild(draggedProject);
        }
    });
});
