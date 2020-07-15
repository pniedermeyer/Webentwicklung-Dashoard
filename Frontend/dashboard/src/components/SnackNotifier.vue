<template>
    <v-snackbar
            v-model="snackbarShown"
            :timeout="3000"
            :top="true"
            :color="snackbarMode"
    >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
            <v-btn
                    dark
                    text
                    v-bind="attrs"
                    @click="snackbarShown = false"
            >
                Schließen
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
    export default {
        name: "snack-notifier",
        data: () => ({
            snackbarShown: false,
            snackbarText: "",
            snackbarMode: "info"
        }),
        methods: {
            /**
             * Shows the snackbar for 3 seconds
             * @param content Text to show
             * @param type [info, success, error or color code]: Which type of snackbar should be shown or the background color
             */
            showSnackbar(content, type) {
                this.snackbarText = content
                this.snackbarShown = true
                this.snackbarMode = type
            },
        }
    };
</script>
