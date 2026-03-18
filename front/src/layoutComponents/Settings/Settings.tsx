import { Settings } from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { useAppStore } from "../../store/appStore";

export const ShowSettings = () => {
    const { isPreviewMode, setIsPreviewMode } = useAppStore();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Ustawienia dostępu"
                    className="h-9 w-9 ml-4 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 hover:bg-blue-100 cursor-pointer"
                >
                    <Settings className="h-5 w-5 text-blue-700" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ustawienia</AlertDialogTitle>
                    <AlertDialogDescription>
                        Zarządzaj dostępem do wersji roboczej bazy usług katalogowych.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <div className="rounded-md border bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="catalog-draft-toggle" className="text-slate-900">
                                    Pokaż zakładkę usług katalogowych
                                </Label>
                                <p className="text-sm text-slate-600">
                                    Wersja robocza może być niepełna i działać niestabilnie.
                                </p>
                            </div>
                            <Switch
                                id="catalog-draft-toggle"
                                checked={isPreviewMode}
                                onCheckedChange={setIsPreviewMode}
                            />
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Zamknij</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};