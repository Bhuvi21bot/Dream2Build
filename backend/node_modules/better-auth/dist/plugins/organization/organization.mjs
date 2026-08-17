import { getSessionFromCtx } from "../../api/routes/session.mjs";
import { PACKAGE_VERSION } from "../../version.mjs";
import { defaultRoles } from "./access/statement.mjs";
import { ORGANIZATION_ERROR_CODES } from "./error-codes.mjs";
import { getOrgAdapter } from "./adapter.mjs";
import { shimContext } from "../../utils/shim.mjs";
import { orgSessionMiddleware } from "./call.mjs";
import { hasPermission } from "./has-permission.mjs";
import { createOrgRole, deleteOrgRole, getOrgRole, listOrgRoles, updateOrgRole } from "./routes/crud-access-control.mjs";
import { acceptInvitation, cancelInvitation, createInvitation, getInvitation, listInvitations, listUserInvitations, rejectInvitation } from "./routes/crud-invites.mjs";
import { addMember, getActiveMember, getActiveMemberRole, leaveOrganization, listMembers, removeMember, updateMemberRole } from "./routes/crud-members.mjs";
import { checkOrganizationSlug, createOrganization, deleteOrganization, getFullOrganization, listOrganizations, setActiveOrganization, updateOrganization } from "./routes/crud-org.mjs";
import { addTeamMember, createTeam, listOrganizationTeams, listTeamMembers, listUserTeams, removeTeam, removeTeamMember, setActiveTeam, updateTeam } from "./routes/crud-team.mjs";
import { APIError } from "@better-auth/core/error";
import { createAuthEndpoint } from "@better-auth/core/api";
import * as z from "zod";
//#region src/plugins/organization/organization.ts
function parseRoles(roles) {
	return Array.isArray(roles) ? roles.join(",") : roles;
}
const createHasPermissionBodySchema = z.object({ organizationId: z.string().optional() }).and(z.xor([z.object({ permission: z.record(z.string(), z.array(z.string())) }), z.object({ permissions: z.record(z.string(), z.array(z.string())) })]));
const createHasPermission = (options) => {
	return createAuthEndpoint("/organization/has-permission", {
		method: "POST",
		requireHeaders: true,
		body: createHasPermissionBodySchema,
		use: [orgSessionMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Check if the user has permission",
				requestBody: { content: { "application/json": { schema: {
					type: "object",
					properties: {
						permission: {
							type: "object",
							description: "The permission to check",
							deprecated: true
						},
						permissions: {
							type: "object",
							description: "The permission to check"
						}
					},
					required: ["permissions"]
				} } } },
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							error: { type: "string" },
							success: { type: "boolean" }
						},
						required: ["success"]
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const activeOrganizationId = ctx.body.organizationId || ctx.context.session.session.activeOrganizationId;
		if (!activeOrganizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		const member = await getOrgAdapter(ctx.context, options).findMemberByOrgId({
			userId: ctx.context.session.user.id,
			organizationId: activeOrganizationId
		});
		if (!member) throw APIError.from("UNAUTHORIZED", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
		const result = await hasPermission({
			role: member.role,
			options,
			permissions: ctx.body.permissions,
			organizationId: activeOrganizationId
		}, ctx);
		return ctx.json({
			error: null,
			success: result
		});
	});
};
function organization(options) {
	const opts = options || {};
	let endpoints = {
		/**
		* ### Endpoint
		*
		* POST `/organization/create`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.createOrganization`
		*
		* **client:**
		* `authClient.organization.create`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-create)
		*/
		createOrganization: createOrganization(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/update`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.updateOrganization`
		*
		* **client:**
		* `authClient.organization.update`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-update)
		*/
		updateOrganization: updateOrganization(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/delete`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.deleteOrganization`
		*
		* **client:**
		* `authClient.organization.delete`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-delete)
		*/
		deleteOrganization: deleteOrganization(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/set-active`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.setActiveOrganization`
		*
		* **client:**
		* `authClient.organization.setActive`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-set-active)
		*/
		setActiveOrganization: setActiveOrganization(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/get-full-organization`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.getFullOrganization`
		*
		* **client:**
		* `authClient.organization.getFullOrganization`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-get-full-organization)
		*/
		getFullOrganization: getFullOrganization(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/list`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listOrganizations`
		*
		* **client:**
		* `authClient.organization.list`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-list)
		*/
		listOrganizations: listOrganizations(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/invite-member`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.createInvitation`
		*
		* **client:**
		* `authClient.organization.inviteMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-invite-member)
		*/
		createInvitation: createInvitation(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/cancel-invitation`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.cancelInvitation`
		*
		* **client:**
		* `authClient.organization.cancelInvitation`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-cancel-invitation)
		*/
		cancelInvitation: cancelInvitation(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/accept-invitation`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.acceptInvitation`
		*
		* **client:**
		* `authClient.organization.acceptInvitation`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-accept-invitation)
		*/
		acceptInvitation: acceptInvitation(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/get-invitation`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.getInvitation`
		*
		* **client:**
		* `authClient.organization.getInvitation`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-get-invitation)
		*/
		getInvitation: getInvitation(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/reject-invitation`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.rejectInvitation`
		*
		* **client:**
		* `authClient.organization.rejectInvitation`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-reject-invitation)
		*/
		rejectInvitation: rejectInvitation(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/list-invitations`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listInvitations`
		*
		* **client:**
		* `authClient.organization.listInvitations`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-list-invitations)
		*/
		listInvitations: listInvitations(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/get-active-member`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.getActiveMember`
		*
		* **client:**
		* `authClient.organization.getActiveMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-get-active-member)
		*/
		getActiveMember: getActiveMember(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/check-slug`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.checkOrganizationSlug`
		*
		* **client:**
		* `authClient.organization.checkSlug`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-check-slug)
		*/
		checkOrganizationSlug: checkOrganizationSlug(opts),
		/**
		* Add a member to an organization directly, bypassing the invitation flow.
		*
		* **Server-only:** callable as `auth.api.addMember` from trusted server
		* code. It is not registered as an HTTP route and has no client method, so
		* it runs no session or permission check of its own; the caller is
		* responsible for authorizing the request.
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.addMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-add-member)
		*/
		addMember: addMember(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/remove-member`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.removeMember`
		*
		* **client:**
		* `authClient.organization.removeMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-remove-member)
		*/
		removeMember: removeMember(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/update-member-role`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.updateMemberRole`
		*
		* **client:**
		* `authClient.organization.updateMemberRole`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-update-member-role)
		*/
		updateMemberRole: updateMemberRole(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/leave`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.leaveOrganization`
		*
		* **client:**
		* `authClient.organization.leave`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-leave)
		*/
		leaveOrganization: leaveOrganization(opts),
		listUserInvitations: listUserInvitations(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/list-members`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listMembers`
		*
		* **client:**
		* `authClient.organization.listMembers`
		*/
		listMembers: listMembers(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/get-active-member-role`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.getActiveMemberRole`
		*
		* **client:**
		* `authClient.organization.getActiveMemberRole`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-get-active-member-role)
		*/
		getActiveMemberRole: getActiveMemberRole(opts)
	};
	const teamSupport = opts.teams?.enabled;
	const teamEndpoints = {
		/**
		* ### Endpoint
		*
		* POST `/organization/create-team`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.createTeam`
		*
		* **client:**
		* `authClient.organization.createTeam`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-create-team)
		*/
		createTeam: createTeam(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/list-teams`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listOrganizationTeams`
		*
		* **client:**
		* `authClient.organization.listTeams`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-list-teams)
		*/
		listOrganizationTeams: listOrganizationTeams(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/remove-team`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.removeTeam`
		*
		* **client:**
		* `authClient.organization.removeTeam`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-remove-team)
		*/
		removeTeam: removeTeam(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/update-team`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.updateTeam`
		*
		* **client:**
		* `authClient.organization.updateTeam`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-method-organization-update-team)
		*/
		updateTeam: updateTeam(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/set-active-team`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.setActiveTeam`
		*
		* **client:**
		* `authClient.organization.setActiveTeam`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-set-active-team)
		*/
		setActiveTeam: setActiveTeam(opts),
		/**
		* ### Endpoint
		*
		* GET `/organization/list-user-teams`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listUserTeams`
		*
		* **client:**
		* `authClient.organization.listUserTeams`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-set-active-team)
		*/
		listUserTeams: listUserTeams(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/list-team-members`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.listTeamMembers`
		*
		* **client:**
		* `authClient.organization.listTeamMembers`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-set-active-team)
		*/
		listTeamMembers: listTeamMembers(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/add-team-member`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.addTeamMember`
		*
		* **client:**
		* `authClient.organization.addTeamMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-add-team-member)
		*/
		addTeamMember: addTeamMember(opts),
		/**
		* ### Endpoint
		*
		* POST `/organization/remove-team-member`
		*
		* ### API Methods
		*
		* **server:**
		* `auth.api.removeTeamMember`
		*
		* **client:**
		* `authClient.organization.removeTeamMember`
		*
		* @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/organization#api-remove-team-member)
		*/
		removeTeamMember: removeTeamMember(opts)
	};
	if (teamSupport) endpoints = {
		...endpoints,
		...teamEndpoints
	};
	const dynamicAccessControlEndpoints = {
		createOrgRole: createOrgRole(opts),
		deleteOrgRole: deleteOrgRole(opts),
		listOrgRoles: listOrgRoles(opts),
		getOrgRole: getOrgRole(opts),
		updateOrgRole: updateOrgRole(opts)
	};
	if (opts.dynamicAccessControl?.enabled) endpoints = {
		...endpoints,
		...dynamicAccessControlEndpoints
	};
	const roles = {
		...defaultRoles,
		...opts.roles
	};
	const teamSchema = teamSupport ? {
		team: {
			modelName: opts.schema?.team?.modelName,
			fields: {
				name: {
					type: "string",
					required: true,
					fieldName: opts.schema?.team?.fields?.name
				},
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.team?.fields?.organizationId,
					index: true
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.team?.fields?.createdAt
				},
				updatedAt: {
					type: "date",
					required: false,
					fieldName: opts.schema?.team?.fields?.updatedAt,
					onUpdate: () => /* @__PURE__ */ new Date()
				},
				...opts.schema?.team?.additionalFields || {}
			}
		},
		teamMember: {
			modelName: opts.schema?.teamMember?.modelName,
			fields: {
				teamId: {
					type: "string",
					required: true,
					references: {
						model: "team",
						field: "id"
					},
					fieldName: opts.schema?.teamMember?.fields?.teamId,
					index: true
				},
				userId: {
					type: "string",
					required: true,
					references: {
						model: "user",
						field: "id"
					},
					fieldName: opts.schema?.teamMember?.fields?.userId,
					index: true
				},
				createdAt: {
					type: "date",
					required: false,
					fieldName: opts.schema?.teamMember?.fields?.createdAt
				}
			}
		}
	} : {};
	const organizationRoleSchema = opts.dynamicAccessControl?.enabled ? { organizationRole: {
		fields: {
			organizationId: {
				type: "string",
				required: true,
				references: {
					model: "organization",
					field: "id"
				},
				fieldName: opts.schema?.organizationRole?.fields?.organizationId,
				index: true
			},
			role: {
				type: "string",
				required: true,
				fieldName: opts.schema?.organizationRole?.fields?.role,
				index: true
			},
			permission: {
				type: "string",
				required: true,
				fieldName: opts.schema?.organizationRole?.fields?.permission
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				fieldName: opts.schema?.organizationRole?.fields?.createdAt
			},
			updatedAt: {
				type: "date",
				required: false,
				fieldName: opts.schema?.organizationRole?.fields?.updatedAt,
				onUpdate: () => /* @__PURE__ */ new Date()
			},
			...opts.schema?.organizationRole?.additionalFields || {}
		},
		modelName: opts.schema?.organizationRole?.modelName
	} } : {};
	const schema = {
		organization: {
			modelName: opts.schema?.organization?.modelName,
			fields: {
				name: {
					type: "string",
					required: true,
					sortable: true,
					fieldName: opts.schema?.organization?.fields?.name
				},
				slug: {
					type: "string",
					required: true,
					unique: true,
					sortable: true,
					fieldName: opts.schema?.organization?.fields?.slug,
					index: true
				},
				logo: {
					type: "string",
					required: false,
					fieldName: opts.schema?.organization?.fields?.logo
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.organization?.fields?.createdAt
				},
				metadata: {
					type: "string",
					required: false,
					fieldName: opts.schema?.organization?.fields?.metadata
				},
				...opts.schema?.organization?.additionalFields || {}
			}
		},
		...organizationRoleSchema,
		...teamSchema,
		member: {
			modelName: opts.schema?.member?.modelName,
			fields: {
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.member?.fields?.organizationId,
					index: true
				},
				userId: {
					type: "string",
					required: true,
					fieldName: opts.schema?.member?.fields?.userId,
					references: {
						model: "user",
						field: "id"
					},
					index: true
				},
				role: {
					type: "string",
					required: true,
					sortable: true,
					defaultValue: "member",
					fieldName: opts.schema?.member?.fields?.role
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.member?.fields?.createdAt
				},
				...opts.schema?.member?.additionalFields || {}
			}
		},
		invitation: {
			modelName: opts.schema?.invitation?.modelName,
			fields: {
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.invitation?.fields?.organizationId,
					index: true
				},
				email: {
					type: "string",
					required: true,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.email,
					index: true
				},
				role: {
					type: "string",
					required: false,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.role
				},
				...teamSupport ? { teamId: {
					type: "string",
					required: false,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.teamId
				} } : {},
				status: {
					type: "string",
					required: true,
					sortable: true,
					defaultValue: "pending",
					fieldName: opts.schema?.invitation?.fields?.status
				},
				expiresAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.invitation?.fields?.expiresAt
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.invitation?.fields?.createdAt,
					defaultValue: () => /* @__PURE__ */ new Date()
				},
				inviterId: {
					type: "string",
					references: {
						model: "user",
						field: "id"
					},
					fieldName: opts.schema?.invitation?.fields?.inviterId,
					required: true
				},
				...opts.schema?.invitation?.additionalFields || {}
			}
		}
	};
	return {
		id: "organization",
		version: PACKAGE_VERSION,
		endpoints: {
			...shimContext(endpoints, {
				orgOptions: opts,
				roles,
				getSession: async (context) => {
					return await getSessionFromCtx(context);
				}
			}),
			hasPermission: createHasPermission(opts)
		},
		schema: {
			...schema,
			session: { fields: {
				activeOrganizationId: {
					type: "string",
					required: false,
					input: false,
					fieldName: opts.schema?.session?.fields?.activeOrganizationId
				},
				...teamSupport ? { activeTeamId: {
					type: "string",
					required: false,
					input: false,
					fieldName: opts.schema?.session?.fields?.activeTeamId
				} } : {}
			} }
		},
		$Infer: {
			Organization: {},
			Invitation: {},
			Member: {},
			Team: teamSupport ? {} : {},
			TeamMember: teamSupport ? {} : {},
			ActiveOrganization: {}
		},
		$ERROR_CODES: ORGANIZATION_ERROR_CODES,
		options: opts
	};
}
//#endregion
export { organization, parseRoles };
