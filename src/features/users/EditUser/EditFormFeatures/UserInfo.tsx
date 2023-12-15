import { useState, useEffect, ChangeEvent, useRef } from "react";
import { convertToBase64 } from "./convertToBase64";
import {
	useDeleteImageMutation,
	useGetImagesQuery,
	useSendImageMutation,
} from "../../../imagesApi/imagesApiSlice";
import { IUser } from "../../../../shared/interfaces/user.interface";
import { CSSTransition } from "react-transition-group";

import { ReactComponent as UserIcon } from "../../../../shared/icons/avatar.svg";
import { ReactComponent as CameraIcon } from "../../../../shared/icons/camera.svg";
import { ReactComponent as TrashIcon } from "../../../../shared/icons/trash.svg";
import { ReactComponent as ArrowIcon } from "../../../../shared/icons/arrow-right-from-bracket.svg";

interface IUserInfoProps {
	user: IUser;
}

const UserInfo = ({ user }: IUserInfoProps) => {
	const [imgModal, setImgModal] = useState(false);
	const imgModalRef = useRef(null);

	const [postImage, setPostImage] = useState({ myFile: "" });
	const imgRef = useRef(postImage.myFile);

	const [deleteImage] = useDeleteImageMutation();
	const [sendImage] = useSendImageMutation();

	const { img }: any = useGetImagesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 15000,
		selectFromResult: ({ data }: any) => {
			const findImg = data?.ids?.find((img: string) => data?.entities[img]);

			return {
				img: findImg ? data?.entities[findImg] : null,
			};
		},
	});

	const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target && e?.target?.files) {
			const file: File = e.target.files[0];
			const base64 = await convertToBase64(file);
			setPostImage({ ...postImage, myFile: base64 });
		}
	};

	useEffect(() => {
		if (postImage.myFile !== "" && imgRef.current !== postImage.myFile) {
			sendImage({ icon: postImage.myFile, user: user.id });
		}

		imgRef.current = postImage.myFile;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postImage.myFile]);

	return (
		<div className="user_info">
			<div className="avatar_wrapper" onClick={() => setImgModal(!imgModal)}>
				<div className="avatar">
					{img?.icon ? (
						<img className="avatar" src={img?.icon} alt="icon" />
					) : (
						<UserIcon />
					)}
				</div>
				<input
					type="file"
					id="avatar-upload"
					accept=".jpeg, .png, .jpg"
					onChange={(e) => handleFileUpload(e)}
				/>
				<div className="camera_wrapper" onClick={() => setImgModal(!imgModal)}>
					<div className="camera">
						<CameraIcon />
					</div>
				</div>
			</div>
			<CSSTransition
				in={imgModal}
				timeout={0}
				nodeRef={imgModalRef}
				unmountOnExit
			>
				<div className="img_modal" ref={imgModalRef}>
					<label htmlFor="avatar-upload">
						<div>
							<ArrowIcon style={{ transform: "rotate(-90deg)" }} />
							Upload photo
						</div>
					</label>
					{img?.icon && (
						<div
							onClick={() => {
								deleteImage({ id: img?.user });
								setImgModal(!imgModal);
							}}
						>
							<TrashIcon />
							Delete currunt photo
						</div>
					)}
				</div>
			</CSSTransition>
			<h2 className="username">{user.username}</h2>
		</div>
	);
};

export default UserInfo;
