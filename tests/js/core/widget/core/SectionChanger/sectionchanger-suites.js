/*jshint unused: false*/

var suites = {

	def: {
		name: "horizontal",
		options: {
			orientation: "horizontal"
		}
	},

	orientation: [
		{
			name: "horizontal",
			options: {
				orientation: "horizontal",
				animationDuration: 0
			},
			moves: [
				{
					name: "right",
					cord: {x: -300, y: 0},
					sections: {
						before: [false, true, false],
						after: [false, false, true]
					}
				},
				{
					name: "left",
					cord: {x: 300, y: 0},
					sections: {
						before: [false, true, false],
						after: [true, false, false]
					}
				}
			]
		},
		{
			name: "vertical",
			options: {
				orientation: "vertical",
				animationDuration: 0
			},
			moves: [
				{
					name: "top",
					cord: {x: 0, y: -300},
					sections: {
						before: [false, true, false],
						after: [false, false, true]
					}
				},
				{
					name: "bottom",
					cord: {x: 0, y: 300},
					sections: {
						before: [false, true, false],
						after: [true, false, false]
					}
				}
			]
		}
	],

	circular: {
		name: "circular",
		options: {
			circular: true,
			animationDuration: 0
		},
		moves: [
			{
				name: "step left-1",
				cord: {x: 300, y: 0},
				sections: {
					before: [false, true, false],
					after: [true, false, false]
				}
			},
			{
				name: "step left-2",
				cord: {x: 300, y: 0},
				sections: {
					before: [true, false, false],
					after: [false, false, true]
				}
			},
			{
				name: "step left-3",
				cord: {x: 300, y: 0},
				sections: {
					before: [false, false, true],
					after: [false, true, false]
				}
			},
			{
				name: "step right-1",
				cord: {x: -300, y: 0},
				sections: {
					before: [false, true, false],
					after: [false, false, true]
				}
			},
			{
				name: "step right-2",
				cord: {x: -300, y: 0},
				sections: {
					before: [false, false, true],
					after: [true, false, false]
				}
			}
		]
	},

	bouncing: {
		name: "bouncing",
		options: {
			useBouncingEffect: true
		},
		moves: [
			{
				name: "step left-1",
				cord: {x: 300, y: 0},
				sections: {
					before: [false, true, false],
					after: [true, false, false]
				}
			},
			{
				name: "step left-2",
				cord: {x: 300, y: 0},
				sections: {
					before: [true, false, false],
					after: [true, false, false]
				}
			}
		]
	},

	scrollbar: [
		{
			name: "default tab",
			options: {
				scrollbar: "tab"
			},
			contains: [".ui-tab-indicator"]
		},
		{
			name: "default bar",
			options: {
				scrollbar: "bar"
			},
			contains: [".ui-scrollbar-bar-type", ".ui-scrollbar-horizontal"]
		},
		{
			name: "vertical bar",
			options: {
				scrollbar: "bar",
				orientation: "vertical"

			},
			contains: [".ui-scrollbar-bar-type", ".ui-scrollbar-vertical"]
		}
	]

};
