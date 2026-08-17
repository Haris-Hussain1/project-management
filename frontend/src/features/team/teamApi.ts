import {
  getProjects,
} from "../../services/projectService";

import type {
  Project,
  ProjectMembership,
  User,
} from "../../types";

export interface TeamMember {
  user: User;
  roles: string[];
  projectCount: number;
  projects: string[];
}

function addMember(
  members: Map<number, TeamMember>,
  membership: ProjectMembership,
  project: Project,
) {
  const existing = members.get(
    membership.user.id,
  );

  if (!existing) {
    members.set(membership.user.id, {
      user: membership.user,
      roles: [membership.role],
      projectCount: 1,
      projects: [project.name],
    });

    return;
  }

  if (!existing.roles.includes(membership.role)) {
    existing.roles.push(membership.role);
  }

  if (!existing.projects.includes(project.name)) {
    existing.projects.push(project.name);
    existing.projectCount += 1;
  }
}

export async function getTeamMembers(): Promise<
  TeamMember[]
> {
  const projects = await getProjects();

  const members = new Map<
    number,
    TeamMember
  >();

  projects.forEach((project) => {
    project.members.forEach(
      (membership) => {
        addMember(
          members,
          membership,
          project,
        );
      },
    );
  });

  return Array.from(members.values()).sort(
    (a, b) => {
      const nameA =
        a.user.first_name ||
        a.user.username ||
        "";

      const nameB =
        b.user.first_name ||
        b.user.username ||
        "";

      return nameA.localeCompare(nameB);
    },
  );
}