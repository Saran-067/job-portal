import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const UpdateProfileDialog = ({ open, setOpen, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.join(', ') || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const updatedData = {
            ...formData,
            skills: formData.skills.split(',').map((skill) => skill.trim()),
        };
        onUpdate(updatedData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Bio</Label>
                        <Input
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Skills (comma-separated)</Label>
                        <Input
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
