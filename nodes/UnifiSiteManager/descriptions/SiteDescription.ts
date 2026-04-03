import { INodeProperties } from 'n8n-workflow';

export const siteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['site'],
			},
		},
		options: [
			{
				name: 'List Devices',
				value: 'listDevices',
				description: 'List all devices',
				action: 'List devices',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/devices',
						qs: {
							'hostIds[]': '={{ $parameter.additionalFields?.hostIds ? $parameter.additionalFields.hostIds.split(",").map(id => id.trim()) : undefined }}',
							time: '={{ $parameter.additionalFields?.time || undefined }}',
							pageSize: '={{ $parameter.additionalFields?.pageSize || undefined }}',
							nextToken: '={{ $parameter.additionalFields?.nextToken || undefined }}',
						},
					},
				},
			},
			{
				name: 'List Sites',
				value: 'listSites',
				description: 'List all sites',
				action: 'List sites',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/sites',
						qs: {
							pageSize: '={{ $parameter.additionalFields?.pageSize }}',
							nextToken: '={{ $parameter.additionalFields?.nextToken }}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'setKeyValue',
								properties: {
									extractedSites: '={{ $parameter.options?.splitIntoItems ? $response.body.data : [$response.body] }}',
								},
							},
							{
								type: 'rootProperty',
								properties: {
									property: 'extractedSites',
								},
							},
						],
					},
				},
			},
		],
		default: 'listSites',
	},
];

export const siteFields: INodeProperties[] = [
	// List Sites Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['listSites'],
			},
		},
		options: [
			{
				displayName: 'Split Into Items',
				name: 'splitIntoItems',
				type: 'boolean',
				default: false,
				description: 'Whether to split each site into its own item. When enabled, each site from the data array becomes a separate item for easier processing.',
			},
		],
	},
	// List Sites Fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['listSites'],
			},
		},
		options: [
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'string',
				default: '',
				description: 'Number of items to return per page',
			},
			{
				displayName: 'Next Token',
				name: 'nextToken',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Token for pagination to retrieve the next set of results',
			},
		],
	},

	// List Devices Fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['listDevices'],
			},
		},
		options: [
			{
				displayName: 'Host IDs',
				name: 'hostIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of host IDs to filter the results',
			},
			{
				displayName: 'Time',
				name: 'time',
				type: 'string',
				default: '',
				description: 'Last processed timestamp of devices in RFC3339 format (e.g., 2024-01-01T00:00:00Z)',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'string',
				default: '',
				description: 'Number of items to return per page',
			},
			{
				displayName: 'Next Token',
				name: 'nextToken',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Token for pagination to retrieve the next set of results',
			},
		],
	},
];
