/* projectListTemplate it's a template from index.html between the lines 30 and 37 that I use to move
and show in the DOM. All the elements within the <template></template> tags, by default are not being
rendered in the DOM, so you have to extract their content, copy it, and use it on wherever you want. */
const projectListTemplate = document.getElementById('project-list')! as HTMLTemplateElement;
const projectsListContainer = document.getElementById('projects-list-container')! as HTMLDivElement;

const projectList = projectListTemplate.content.children[0]! as HTMLElement;

/* The class ProjectList it's in charge of creating a new project list. */
export class ProjectList {
    constructor(private listType: 'active' | 'finished') {
        /* With 'document.importNode()', I create a copy of the project list node, and with the second boolean
        argument, I specify that I want a DEEP copy of that project list node, with all of its childrens. */
        const projectListCopy = document.importNode(projectList, true);
        projectListCopy.id = `${this.listType}-projects-list`;
        projectsListContainer.appendChild(projectListCopy);

        const projectListH2 = projectListCopy.children[0].children[0]! as HTMLHeadElement;
        const projectListUL = projectListCopy.children[1]! as HTMLUListElement;

        projectListH2.textContent = `${this.listType.toUpperCase()} PROJECTS`;
        projectListUL.id = `${this.listType}-projects`;
    }
}
