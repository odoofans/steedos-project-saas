import React from 'react';
import { Provider } from 'react-redux';
import { Bootstrap, Dashboard, entityStateSelector, store } from '@steedos/react';
import { getBetweenTimeBuiltinValueItem } from '@steedos/filters';

let config = {
    "apps": {
        "label": "应用程序启动器",
        "position": "RIGHT",
        "type": "apps",
        "mobile": true,
        "ignoreApps": ["oa"]
    },
    "workflow": {
        "label": "待审核文件",
        "position": "CENTER_TOP",
        "type": "object",
        "objectName": "instances",
        "filters": [
            ["space", "=", "{spaceId}"],
            [
                ["inbox_users", "=", "{userId}"], "or", ["cc_users", "=", "{userId}"]
            ]
        ],
        "columns": [{
            "label": "名称",
            "field": "name",
            "href": true
        }, {
            "label": "提交人",
            "field": "submitter_name",
            "width": "10rem"
        }, {
            "label": "修改时间",
            "field": "modified",
            "type": "datetime",
            "width": "10rem"
        }],
        "noHeader": false,
        "unborderedRow": true,
        "showAllLink": true,
        "illustration": {
            "messageBody": "您没有待审核文件"
        },
        rowIcon: {
            category: "standard",
            name: "task",
            size: "small"
        }
    },
    "tasks": {
        "label": "今日任务",
        "position": "CENTER_BOTTOM_LEFT",
        "type": "object",
        "objectName": "tasks",
        "filters": [
            ["assignees", "=", "{userId}"],
            ["state", "<>", "complete"],
            ['due_date', 'between', 'last_30_days']
        ],
        "sort": "due_date",
        "columns": [{
            "field": "name",
            "label": "主题",
            "href": true
        }, {
            "field": "due_date",
            "label": "到期日期",
            "width": "10rem",
            "type": "date"
        }],
        "unborderedRow": true,
        "showAllLink": true,
        "illustration": {
            "messageBody": "您今天没有待办任务"
        },
        rowIcon: {
            category: "standard",
            name: "timesheet_entry",
            size: "small"
        }
    },
    "calendar": {
        label: "今日日程",
        position: "CENTER_BOTTOM_RIGHT",
        type: "object",
        objectName: "events",
        filters: function(){
            let utcOffset = Creator.USER_CONTEXT.user && Creator.USER_CONTEXT.user.utcOffset;
            let today = getBetweenTimeBuiltinValueItem("today", utcOffset);
            let start = today.values[0];
            let end = today.values[1];
            return [[
                ['owner', '=', '{userId}'], 
                'or', 
                ['assignees', '=', '{userId}']
            ], [
                ['end', '>=', start], 
                ['start', '<=', end]
            ]]
        },
        sort: "start desc, end",
        columns: [{
            field: "name",
            label: "主题",
            href: true
        }, {
            "field": "start",
            "label": "开始时间",
            "width": "10rem",
            "type": "datetime"
        }],
        unborderedRow: true,
        showAllLink: true,
        illustration:{
            messageBody: "您今天没有日程"
        },
        rowIcon: {
            category: "standard",
            name: "event",
            size: "small"
        }
    },
    "announcements": {
        "label": "本周公告",
        "position": "RIGHT",
        "type": "object",
        "objectName": "announcements",
        "filters": [
            ["owner", "=", "{userId}"],
            ["members", "=", "{userId}"],
            ['created', 'between', 'last_7_days']
        ],
        "sort": "created desc",
        "columns": [{
            "field": "name",
            "label": "标题",
            "href": true
        },{
            "field": "created",
            "label": "发布时间",
            "width": "10rem",
            "type": "datetime"
        }],
        "noHeader": false,
        "unborderedRow": true,
        "showAllLink": true,
        "illustration": {
            "messageBody": "本周没有新公告"
        },
        rowIcon: {
            category: "standard",
            name: "announcement",
            size: "small"
        }
    }
};

const Home = () => (
    <Provider store={store}>
        <Bootstrap>
            <Dashboard config={config} />
        </Bootstrap>
    </Provider>
)
class ContractsAppPlugin {
    initialize(registry, store) {
        registry.registerObjectHomeComponent(
            'oa_home',
            Home
        );
    }
}

window.registerPlugin('com.steedos.contracts-app', new ContractsAppPlugin());